import { Maybe, MaybeArray } from 'services/app.types';
import { defineBookingEntityAbilitiesFor } from 'services/core/booking/booking.ability';
import { BookingEntity } from 'services/core/booking/booking.entity';
import {
  errorEditingBooking,
  errorGettingBookingList,
  errorGettingSingleBooking,
  errorSavingBooking,
} from 'services/core/booking/booking.errors';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import { bookingRepository } from 'services/core/booking/booking.repository';
import {
  ICreateBookingDto,
  GetBookingListByUserServiceParams,
  GetSingleBookingServiceParams,
  IBookingDomain,
  IEditBookingDto,
} from 'services/core/booking/booking.types';
import { CarId } from 'services/core/car/car.types';
import { userRepository } from 'services/core/user/user.repository';
import { IUserDomain, Username } from 'services/core/user/user.types';

export class BookingService {
  createBooking = async (
    body: ICreateBookingDto,
  ): Promise<Maybe<IBookingDomain>> => {
    try {
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
    const currentDateSeconds = Date.now() / 1000;
    const oneWeekAheadSeconds = 60 * 60 * 24 * 7;
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

    try {
      const booking = await bookingRepository.getSingleBooking({
        user,
        carId,
        startTime,
      });

      return [undefined, booking];
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
  ): Promise<Maybe<boolean | IBookingDomain>> => {
    // todo validate fields we are trying to edit
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

        return [undefined, editedBooking];
      } catch (error) {
        return [errorEditingBooking, false];
      }
    } else {
      try {
        await bookingRepository.editNonKeyBookingAttrs({
          username: whoseBooking || authenticatedUser.username,
          carId,
          startTime,
          dataToEdit,
        });

        return [undefined, true];
      } catch (error) {
        console.error(error);

        return [errorEditingBooking, false];
      }
    }
  };

  isCarAvailableToUser = async (
    carId: CarId,
    username: Username,
  ): Promise<boolean> => {
    const user = await userRepository.getOneByUsername(username);

    return user.availableCars.includes(carId);
  };

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
