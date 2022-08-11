import { Maybe, MaybeArray } from 'app.types';
import { defineBookingEntityAbilitiesFor } from 'core/booking/booking.ability';
import { BookingEntity } from 'core/booking/booking.entity';
import {
  errorGettingBookingList,
  errorGettingSingleBooking,
  errorSavingBooking,
} from 'core/booking/booking.errors';
import { bookingMapper } from 'core/booking/booking.mapper';
import { bookingRepository } from 'core/booking/booking.repository';
import {
  ICreateBookingDto,
  GetBookingListByUserServiceParams,
  GetSingleBookingServiceParams,
  IBookingDomain,
} from 'core/booking/booking.types';
import { CarId } from 'core/car/car.types';
import { userRepository } from 'core/user/user.repository';
import { Username } from 'core/user/user.types';

export class BookingService {
  createBooking = async (
    body: ICreateBookingDto,
  ): Promise<Maybe<IBookingDomain>> => {
    try {
      const booking = bookingMapper.dtoToDomain(body);

      console.log('booking', booking);

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

  isCarAvailableToUser = async (
    carId: CarId,
    username: Username,
  ): Promise<boolean> => {
    const user = await userRepository.getOneByUsername(username);

    return user.availableCars.includes(carId);
  };
}

export const bookingService = new BookingService();
