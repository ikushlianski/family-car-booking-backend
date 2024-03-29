import { Maybe, MaybeArray } from 'services/app.types';
import { defineBookingEntityAbilitiesFor } from 'services/core/booking/booking.ability';
import { BookingEntity } from 'services/core/booking/booking.entity';
import {
  bookingNotFoundError,
  errorDeletingBooking,
  errorEditingBooking,
  errorGettingBookingList,
  errorGettingSingleBooking,
  errorSavingBooking,
  forbiddenFieldsForEditError,
  permissionDenied,
} from 'services/core/booking/booking.errors';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import { bookingRepository } from 'services/core/booking/booking.repository';
import {
  ICreateBookingDto,
  GetBookingListByUserServiceParams,
  GetSingleBookingServiceParams,
  IBookingDomain,
  IEditBookingDto,
  FinishRideRepositoryParams,
} from 'services/core/booking/booking.types';
import { bookingValidationService } from 'services/core/booking/booking.validation';
import { CarId } from 'services/core/car/car.types';
import { userRepository } from 'services/core/user/user.repository';
import { IUserDomain, Username } from 'services/core/user/user.types';
import { FamilyCarBookingApp } from 'services/db/db.service';

export class BookingService {
  createBooking = async (
    body: ICreateBookingDto,
    authenticatedUser: IUserDomain,
  ): Promise<Maybe<IBookingDomain>> => {
    try {
      if (body.username !== authenticatedUser.username) {
        return [errorSavingBooking, undefined];
      }

      const booking = bookingMapper.dtoToDomain(body);

      await bookingRepository.saveBooking(booking);

      return [undefined, booking];
    } catch (error) {
      console.error(error);

      return [errorSavingBooking, undefined];
    }
  };

  getNextWeeksBookings = async ({
    user: loggedInUser,
    carId,
    weekCount = 2,
    rolesMetadata: { requestingForUsername },
  }: GetBookingListByUserServiceParams): Promise<
    MaybeArray<BookingEntity>
  > => {
    const secondsInOneDay = 60 * 60 * 24;
    const currentDateSeconds = Date.now() / 1000 - secondsInOneDay;
    const oneWeekAheadSeconds = secondsInOneDay * 7;
    const maxDateSeconds =
      currentDateSeconds + oneWeekAheadSeconds * weekCount;

    if (requestingForUsername) {
      try {
        const otherUser = await userRepository.getOneByUsername(
          requestingForUsername,
        );

        const bookingsByUsername: BookingEntity[] =
          await bookingRepository.getBookingListByUser({
            user: otherUser,
            carId,
            from: currentDateSeconds,
            to: maxDateSeconds,
          });

        const bookingEntityAbilities =
          defineBookingEntityAbilitiesFor(loggedInUser);

        const allowedBookings = bookingsByUsername.filter((booking) => {
          return bookingEntityAbilities.can('read', booking);
        });

        return [undefined, allowedBookings];
      } catch (e) {
        console.error('Error querying booking list', e);

        return [errorGettingBookingList, undefined];
      }
    }

    try {
      const bookingsByCar = await bookingRepository.getBookingListByCar({
        carId,
        from: currentDateSeconds,
        to: maxDateSeconds,
      });

      // we don't need to check abilities here as this is the logged-in user's car

      return [undefined, bookingsByCar];
    } catch (e) {
      console.error('Error querying booking list', e);

      return [errorGettingBookingList, undefined];
    }
  };

  getBookingDetails = async ({
    user,
    carId,
    startTime,
  }: GetSingleBookingServiceParams): Promise<Maybe<BookingEntity>> => {
    // todo use roles to see whether the user can get booking details

    console.log({
      user,
      carId,
      startTime,
    });

    try {
      const booking = await bookingRepository.getSingleBooking({
        user,
        carId,
        startTime,
      });

      console.log('booking', booking);

      return booking
        ? [undefined, booking]
        : [bookingNotFoundError, undefined];
    } catch (e) {
      console.error('Error querying single booking', e);

      return [errorGettingSingleBooking, undefined];
    }
  };

  editBooking = async (
    authenticatedUser: IUserDomain,
    whoseBooking: Username | undefined,
    carId: CarId,
    startTime: string,
    dataToEdit: IEditBookingDto,
  ): Promise<Maybe<IBookingDomain>> => {
    const invalidFieldsSuppliedError =
      bookingValidationService.checkFieldsToBeEdited(dataToEdit);

    if (invalidFieldsSuppliedError) {
      return [forbiddenFieldsForEditError, undefined];
    }

    if (dataToEdit.startDateTime) {
      // we have to remove the existing booking and create a copy of the old one but with updated time
      try {
        const editedBooking =
          await bookingRepository.replaceBookingWithNewStartDate({
            username: whoseBooking || authenticatedUser.username,
            carId,
            startTime,
            dataToEdit,
          });

        console.log('editedBooking', editedBooking);

        return [undefined, editedBooking];
      } catch (error) {
        return [errorEditingBooking, undefined];
      }
    } else {
      try {
        const editedBooking =
          await bookingRepository.editNonKeyBookingAttrs({
            username: whoseBooking || authenticatedUser.username,
            carId,
            startTime,
            dataToEdit,
          });

        return [undefined, editedBooking];
      } catch (error) {
        console.error(error);

        return [errorEditingBooking, undefined];
      }
    }
  };

  deleteBooking = async (
    authenticatedUser: IUserDomain,
    whoseBooking: Username | undefined,
    carId: CarId,
    startTime: string,
  ): Promise<true | Error> => {
    try {
      if (whoseBooking !== authenticatedUser.username) {
        return errorDeletingBooking;
      }

      const exists = await bookingRepository.checkBookingExists({
        username: whoseBooking,
        carId,
        startTime: +startTime,
      });

      if (!exists) {
        return bookingNotFoundError;
      }
    } catch (e) {
      return errorDeletingBooking;
    }

    try {
      await bookingRepository.removeOne({
        username: whoseBooking,
        carId,
        startTime,
      });

      return true;
    } catch (error) {
      console.error(error);

      return errorDeletingBooking;
    }
  };

  isCarAvailableToUser = async (
    carId: CarId,
    username: Username,
  ): Promise<boolean> => {
    const user = await userRepository.getOneByUsername(username);

    return user.availableCars.includes(carId);
  };

  finishRide = async ({
    username,
    carId,
    startTime,
    authenticatedUser,
    finishRideData: { rideCompletionText, endDateTime },
  }: FinishRideRepositoryParams): Promise<Error | boolean> => {
    if (username !== authenticatedUser.username) {
      return permissionDenied;
    }

    try {
      const item = await FamilyCarBookingApp.entities.booking
        .get({ username, carId, startTime })
        .go();

      if (!item) return bookingNotFoundError;

      const updatePromise = FamilyCarBookingApp.entities.booking.update({
        username,
        carId,
        startTime,
      });

      if (rideCompletionText) {
        updatePromise.set({
          carLocationAfterRideText: rideCompletionText,
        });
      }

      if (endDateTime) {
        updatePromise.set({ endTime: endDateTime });
      } else {
        updatePromise.set({ endTime: Math.ceil(Date.now() / 1000) });
      }

      await updatePromise.set({ isFinished: true }).go();

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  // todo move these functions to a separate permissions service
  canCreate = async (
    authenticatedUser: IUserDomain,
    whoseBooking: Username,
    carId: CarId,
  ) => {
    // todo add roles
    return true;
  };

  canEdit = async (
    authenticatedUser: IUserDomain,
    whoseBooking: Username,
    carId: CarId,
    startTime: string,
  ) => {
    // todo add roles
    return true;
  };

  canDelete = async (
    authenticatedUser: IUserDomain,
    whoseBooking: Username,
    carId: CarId,
    startTime: string,
  ) => {
    // todo add roles
    return true;
  };
}

export const bookingService = new BookingService();
