import { BookingEntity } from 'services/core/booking/booking.entity';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import {
  EditBookingRepositoryParams,
  GetBookingListByCarIdRepositoryParams,
  GetBookingListByUserRepositoryParams,
  GetSingleBookingRepositoryParams,
  IBookingDb,
  IBookingDomain,
} from 'services/core/booking/booking.types';
import { FamilyCarBookingApp } from 'services/db/db.service';

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

  saveBooking = async (bookingDomain: IBookingDomain) => {
    const booking: IBookingDb = bookingMapper.domainToDb(bookingDomain);

    return await FamilyCarBookingApp.entities.booking
      .create({
        username: booking.username,
        carId: booking.carId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.description,
      })
      .go();
  };

  editNonKeyBookingAttrs = async ({
    username,
    carId,
    startTime,
    dataToEdit,
  }: EditBookingRepositoryParams) => {
    // todo what does .update method return?
    return await FamilyCarBookingApp.entities.booking
      .update({
        username,
        carId,
        startTime: +startTime,
      })
      .data((attr, op) => {
        if (dataToEdit.endDateTime) {
          op.set(attr.endTime, dataToEdit.endDateTime);
        }

        if (dataToEdit.description) {
          op.set(attr.description, dataToEdit.description);
        }
      })
      .go();
  };

  replaceBookingWithNewStartDate = async ({
    username,
    carId,
    startTime: originalStartTime,
    dataToEdit,
  }: EditBookingRepositoryParams): Promise<IBookingDomain> => {
    const [originalBooking] =
      await FamilyCarBookingApp.entities.booking.query
        .bookingsByUser({
          username,
          carId,
          startTime: +originalStartTime,
        })
        .go();

    if (!originalBooking) {
      throw new Error('Could not find a booking to edit');
    }

    const newBooking = await FamilyCarBookingApp.entities.booking
      .create({
        username,
        carId,
        startTime: dataToEdit.startDateTime,
        endTime: dataToEdit.endDateTime || originalBooking.endTime,
        description: dataToEdit.description || originalBooking.description,
      })
      .go();

    await FamilyCarBookingApp.entities.booking
      .delete({
        username,
        carId,
        startTime: +originalStartTime,
      })
      .go();

    return new BookingEntity({
      username,
      carId,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      description: newBooking.description,
    });
  };
}

export const bookingRepository = new BookingRepository();
