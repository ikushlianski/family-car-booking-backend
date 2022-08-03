import { BookingEntity } from 'core/booking/booking.entity';
import {
  GetBookingListRepositoryParams,
  GetSingleBookingRepositoryParams,
  IBookingDb,
} from 'core/booking/booking.types';
import { FamilyCarBookingApp } from 'db/db.service';

export class BookingRepository {
  getList = async ({
    user,
    carId,
    from,
    to,
  }: GetBookingListRepositoryParams): Promise<BookingEntity[]> => {
    const bookingList: IBookingDb[] =
      await FamilyCarBookingApp.entities.booking.query
        .bookings({ username: user.username, carId })
        .where(
          (attr, op) =>
            `${op.gte(attr.startTime, from)} AND ${op.lte(
              attr.startTime,
              to,
            )}`,
        )
        .go();

    return bookingList.map(
      ({ carId, startTime, endTime, description }) => {
        return new BookingEntity(
          {
            username: user.username,
            carId,
            startTime,
            endTime,
            description,
          },
          user,
        );
      },
    );
  };

  getSingleBooking = async ({
    user,
    carId: _carId,
    startTime: _startTime,
  }: GetSingleBookingRepositoryParams): Promise<BookingEntity> => {
    const [{ carId, startTime, endTime, description }] =
      await FamilyCarBookingApp.entities.booking.query
        .bookings({
          username: user.username,
          carId: _carId,
          startTime: _startTime,
        })
        .go();

    return new BookingEntity(
      { username: user.username, carId, startTime, endTime, description },
      user,
    );
  };
}

export const bookingRepository = new BookingRepository();
