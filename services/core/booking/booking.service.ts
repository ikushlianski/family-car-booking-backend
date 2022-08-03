import { Maybe, MaybeArray } from 'app.types';
import { BookingEntity } from 'core/booking/booking.entity';
import {
  errorGettingBookingList,
  errorGettingSingleBooking,
} from 'core/booking/booking.errors';
import { bookingRepository } from 'core/booking/booking.repository';
import {
  GetBookingListServiceParams,
  GetSingleBookingServiceParams,
} from 'core/booking/booking.types';

export class BookingService {
  getNextWeeksBookings = async ({
    user,
    carId,
    weekCount = 2,
    rolesMetadata: {
      requestingOwnResource,
      currentUserRoles,
      requestingForUser,
    },
  }: GetBookingListServiceParams): Promise<MaybeArray<BookingEntity>> => {
    const currentDateSeconds = Date.now() / 1000;
    const oneWeekAheadSeconds = 60 * 60 * 24 * 7;
    const maxDateSeconds =
      currentDateSeconds + oneWeekAheadSeconds * weekCount;

    try {
      const bookingList = await bookingRepository.getList({
        user,
        carId,
        from: currentDateSeconds,
        to: maxDateSeconds,
      });

      return [undefined, bookingList];
    } catch (e) {
      console.error('Error querying booking list', e);

      return [errorGettingBookingList, undefined];
    }
  };

  getBookingDetails = async ({
    user,
    carId,
    startTime,
    rolesMetadata: { currentUserRoles, requestingOwnResource },
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
}

export const bookingService = new BookingService();
