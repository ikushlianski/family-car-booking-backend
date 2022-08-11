import {
  BookingDescription,
  BookingEndTime,
  BookingNotes,
  BookingStartTime,
  CreateBookingDto,
  IBookingDb,
  IBookingDomain,
} from 'core/booking/booking.types';
import { UserEntity } from 'core/user/user.entity';
import { IUserDomain, Username } from 'core/user/user.types';

export class BookingEntity implements IBookingDomain {
  bookingOwner: UserEntity;
  bookingOwnerId: Username;
  carNumber: string;
  bookingStartTime: BookingStartTime;
  bookingEndTime?: BookingEndTime;
  bookingNotes?: BookingNotes;
  bookingDescription?: BookingDescription;

  constructor(data: IBookingDb | CreateBookingDto, user?: IUserDomain) {
    if (isFromNetwork(data)) {
      this.bookingStartTime = new Date(data.startDateTime);
      this.bookingEndTime = data.endDateTime
        ? new Date(data.endDateTime)
        : undefined;
      this.bookingOwnerId = data.username;
      this.carNumber = data.carId;
      this.bookingDescription = data.description;
    } else {
      const { username, carId, startTime, endTime, description } = data;

      this.bookingStartTime = new Date(startTime * 1000);
      this.bookingEndTime = endTime ? new Date(endTime * 1000) : undefined;
      this.bookingOwnerId = username;
      this.carNumber = carId;
      this.bookingDescription = description;
    }

    if (user) {
      // todo hide some information about the user, use toDTO mapper
      this.bookingOwner = user;
    }
  }
}

function isFromNetwork(
  data: CreateBookingDto | IBookingDb,
): data is CreateBookingDto {
  return data.hasOwnProperty('startDateTime');
}

function isFromDb(
  data: CreateBookingDto | IBookingDb,
): data is IBookingDb {
  return data.hasOwnProperty('startDate');
}
