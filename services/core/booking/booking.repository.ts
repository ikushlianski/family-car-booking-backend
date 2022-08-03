import {
  GetBookingListRepositoryParams,
  GetSingleBookingRepositoryParams,
} from 'core/booking/booking.types';
import { FamilyCarBookingApp } from 'db/db.service';

export class BookingRepository {
  getBookingList = async ({
    username,
    carId,
    from,
    to,
  }: GetBookingListRepositoryParams) => {
    return FamilyCarBookingApp.entities.booking.query
      .bookings({ username, carId })
      .where(
        (attr, op) =>
          `${op.gte(attr.startTime, from)} AND ${op.lte(
            attr.startTime,
            to,
          )}`,
      )
      .go();
  };

  getSingleBooking = async ({
    username,
    carId,
    startTime,
  }: GetSingleBookingRepositoryParams) => {
    const [singleBooking] =
      await FamilyCarBookingApp.entities.booking.query
        .bookings({ username, carId, startTime })
        .go();

    return singleBooking;
  };
}

export const bookingRepository = new BookingRepository();
