import {
  errorGettingBookingList,
  errorGettingSingleBooking,
} from 'core/booking/booking.errors';
import {
  BookingId,
  GetBookingListOptions,
} from 'core/booking/booking.types';
import { FamilyCarBookingApp } from 'db/db.service';

export class BookingService {
  // could be made more flexible and accept `to` and `from` timestamps in a larger app
  getNextWeeksBookings = async ({
    username,
    carId,
    weekCount = 2,
  }: GetBookingListOptions) => {
    const currentDateSeconds = Date.now() / 1000;
    const oneWeekAheadSeconds = 60 * 60 * 24 * 7;
    const maxDateTimestamp =
      currentDateSeconds + oneWeekAheadSeconds * weekCount;

    try {
      const bookingList = await FamilyCarBookingApp.entities.booking.query
        .bookings({ username, carId })
        .where(
          (attr, op) =>
            `${op.gte(attr.startTime, currentDateSeconds)} AND ${op.lte(
              attr.startTime,
              maxDateTimestamp,
            )}`,
        )
        .go();

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
  }: BookingId) => {
    try {
      const [booking] = await FamilyCarBookingApp.entities.booking.query
        .bookings({ username, carId, startTime })
        .go();

      return [null, booking];
    } catch (e) {
      console.error('Error when querying bookings', e);
      return [errorGettingSingleBooking, null];
    }
  };
}

export const bookingService = new BookingService();
