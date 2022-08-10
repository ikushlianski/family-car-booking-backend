import { BookingEntity } from 'core/booking/booking.entity';
import {
  GetBookingListByCarIdRepositoryParams,
  GetBookingListByUserRepositoryParams,
  GetSingleBookingRepositoryParams,
  IBookingDb,
} from 'core/booking/booking.types';
import { IUserDb, Username } from 'core/user/user.types';
import { FamilyCarBookingApp } from 'db/db.service';

export class BookingRepository {
  getBookingListByUser = async ({
    user,
    carId,
    from,
    to,
  }: GetBookingListByUserRepositoryParams): Promise<BookingEntity[]> => {
    const bookingList: IBookingDb[] =
      await FamilyCarBookingApp.entities.booking.query
        .bookingsByUser({ username: user.username, carId })
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

  getBookingListByCar = async ({
    carId,
    from,
    to,
  }: GetBookingListByCarIdRepositoryParams): Promise<BookingEntity[]> => {
    const bookingList: IBookingDb[] =
      await FamilyCarBookingApp.entities.booking.query
        .bookingsByCar({ carId })
        .where(
          (attr, op) =>
            `${op.gte(attr.startTime, from)} AND ${op.lte(
              attr.startTime,
              to,
            )}`,
        )
        .go();

    return bookingList.map(
      ({ username, carId, startTime, endTime, description }) => {
        return new BookingEntity({
          username,
          carId,
          startTime,
          endTime,
          description,
        });
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
        .bookingsByUser({
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
