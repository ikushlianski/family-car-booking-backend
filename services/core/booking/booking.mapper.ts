import { Maybe } from 'services/app.types';
import { BookingEntity } from 'services/core/booking/booking.entity';
import { incorrectDataInBooking } from 'services/core/booking/booking.errors';
import {
  ICreateBookingDto,
  IBookingDomain,
  IBookingDb,
  IGetBookingDto,
} from 'services/core/booking/booking.types';

export class BookingMapper {
  dtoToDomain = ({
    username,
    carId,
    description,
    startDateTime,
    endDateTime,
  }: ICreateBookingDto): IBookingDomain => {
    return new BookingEntity({
      username,
      carId,
      description,
      startDateTime,
      endDateTime,
    });
  };

  domainToDb = ({
    bookingOwnerId,
    carNumber,
    bookingStartTime,
    bookingEndTime,
    bookingDescription,
  }: IBookingDomain): IBookingDb => {
    return {
      username: bookingOwnerId,
      carId: carNumber,
      startTime: bookingStartTime.valueOf() / 1000,
      endTime: bookingEndTime
        ? bookingEndTime.valueOf() / 1000
        : undefined,
      description: bookingDescription,
    };
  };

  domainToDto = (bookingDomain: IBookingDomain): Maybe<IGetBookingDto> => {
    try {
      const bookingStartTime =
        bookingDomain.bookingStartTime.valueOf() / 1000;

      let bookingEndTime;

      if (bookingDomain.bookingEndTime) {
        bookingEndTime = bookingDomain.bookingEndTime.valueOf() / 1000;
      }

      return [
        undefined,
        {
          ...bookingDomain,
          bookingStartTime,
          bookingEndTime,
        },
      ];
    } catch (error) {
      console.error(error);

      return [incorrectDataInBooking, undefined];
    }
  };
}

export const bookingMapper = new BookingMapper();
