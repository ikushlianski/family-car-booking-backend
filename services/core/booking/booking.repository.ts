import { BookingEntity } from 'services/core/booking/booking.entity';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import {
  CheckBookingExistsRepositoryParams,
  DeleteBookingRepositoryParams,
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
      ({ carId, startTime, endTime, description, isFinished }) => {
        return new BookingEntity(
          {
            username: user.username,
            carId,
            startTime,
            endTime,
            description,
            isFinished: Boolean(isFinished),
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
    const [booking] = await FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username: user.username,
        carId: _carId,
        startTime: _startTime,
      })
      .go();

    if (!booking?.carId) {
      return undefined;
    }

    return new BookingEntity(
      {
        username: user.username,
        carId: booking.carId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.description,
        isFinished: Boolean(booking.isFinished),
      },
      user,
    );
  };

  checkBookingExists = async ({
    username,
    carId,
    startTime,
  }: CheckBookingExistsRepositoryParams): Promise<boolean> => {
    const [booking] = await FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username,
        carId,
        startTime,
      })
      .go();

    return Boolean(booking);
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
  }: EditBookingRepositoryParams): Promise<BookingEntity> => {
    await FamilyCarBookingApp.entities.booking
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

    const [freshBooking] = await FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username,
        carId,
        startTime: +startTime,
      })
      .go();

    return new BookingEntity({
      username,
      carId,
      startTime: freshBooking.startTime,
      endTime: freshBooking.endTime,
      description: freshBooking.description,
    });
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

  removeOne = async ({
    username,
    carId,
    startTime,
  }: DeleteBookingRepositoryParams): Promise<boolean> => {
    await FamilyCarBookingApp.entities.booking
      .delete({
        username,
        carId,
        startTime: +startTime,
      })
      .go();

    return true;
  };

  async removeBookingsByUser(username) {
    const bookings = await FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username,
      })
      .go();

    await Promise.all(
      bookings.map((booking) => {
        return FamilyCarBookingApp.entities.booking
          .delete({
            username: booking.username,
            carId: booking.carId,
            startTime: booking.startTime,
          })
          .go();
      }),
    );
  }
}

export const bookingRepository = new BookingRepository();
