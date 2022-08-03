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
    username,
    carId,
    weekCount = 2,
    rolesMetadata: { requestingOwnResource, currentUserRoles },
  }: GetBookingListServiceParams) => {
    const currentDateSeconds = Date.now() / 1000;
    const oneWeekAheadSeconds = 60 * 60 * 24 * 7;
    const maxDateSeconds =
      currentDateSeconds + oneWeekAheadSeconds * weekCount;

    try {
      const bookingList = await bookingRepository.getBookingList({
        username,
        carId,
        from: currentDateSeconds,
        to: maxDateSeconds,
      });

      return [null, bookingList];
    } catch (e) {
      console.error('Error querying booking list', e);

      return [errorGettingBookingList, null];
    }
  };

  getBookingDetails = async ({
    username,
    carId,
    startTime,
    rolesMetadata,
  }: GetSingleBookingServiceParams) => {
    // todo use roles to see whether the user can get booking details

    try {
      const booking = await bookingRepository.getSingleBooking({
        username,
        carId,
        startTime,
      });

      return [null, booking];
    } catch (e) {
      console.error('Error querying single booking', e);
      return [errorGettingSingleBooking, null];
    }
  };
}

export const bookingService = new BookingService();
