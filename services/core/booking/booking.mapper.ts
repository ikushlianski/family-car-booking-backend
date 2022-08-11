import { BookingEntity } from 'core/booking/booking.entity';
import {
  CreateBookingDto,
  IBookingDomain,
} from 'core/booking/booking.types';

export class BookingMapper {
  dtoToBL = ({
    username,
    carId,
    description,
    startDateTime,
    endDateTime,
  }: CreateBookingDto): IBookingDomain => {
    return new BookingEntity({
      username,
      carId,
      description,
      startDateTime,
      endDateTime,
    });
  };
}

export const bookingMapper = new BookingMapper();
