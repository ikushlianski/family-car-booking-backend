import { errorGettingSingleBooking } from 'core/booking/booking.errors';
import { BookingId } from 'core/booking/booking.types';
import { FamilyCarBookingApp } from 'db/db.service';

export class BookingService {
  getBookingDetails = async ({
    username,
    carId,
    startTime,
  }: BookingId) => {
    try {
      const booking = await FamilyCarBookingApp.entities.booking.query
        .singleBooking({ username, carId, startTime })
        .go();

      return [null, booking];
    } catch (e) {
      console.log('Error when querying bookings', e);
      return [errorGettingSingleBooking, null];
    }
  };
}

export const bookingService = new BookingService();
