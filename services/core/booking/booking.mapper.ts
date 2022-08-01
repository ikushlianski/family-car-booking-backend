import { IBookingDomain, IBookingFromDB } from './booking.types';

export const bookingMapperToDomain = (
  bookingFromDB: IBookingFromDB,
): IBookingDomain => {
  return {
    bookingId: bookingFromDB.pk,
    bookingDate: new Date(bookingFromDB.sk),
    bookingStartTime: bookingFromDB.bookingStartTime,
    bookingEndTime: bookingFromDB.bookingEndTime,
    bookingOwner: bookingFromDB.bookingOwner,
    bookingNotes: {
      carParkLocationText: bookingFromDB.carParkLocationText,
      carParkLongitude: bookingFromDB.carParkLongitude,
      carParkLatitude: bookingFromDB.carParkLatitude,
    },
  };
};

export const bookingMapperToDb = (bookingDomain: IBookingDomain) => {
  const bookingForDAL: IBookingFromDB = {
    pk: bookingDomain.bookingId,
    sk: bookingDomain.bookingDate,
    bookingStartTime: bookingDomain.bookingStartTime,
    bookingEndTime: bookingDomain.bookingEndTime,
    bookingOwner: bookingDomain.bookingOwner,
    carParkLocationText: bookingDomain.bookingNotes.carParkLocationText,
    carParkLongitude: bookingDomain.bookingNotes.carParkLongitude,
    carParkLatitude: bookingDomain.bookingNotes.carParkLatitude,
  };

  return bookingForDAL;
};
