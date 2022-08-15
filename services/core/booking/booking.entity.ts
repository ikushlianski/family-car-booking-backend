import {
  BookingDescription,
  BookingEndTime,
  BookingNotes,
  BookingStartTime,
  ICreateBookingDto,
  IBookingDb,
  IBookingDomain,
} from 'services/core/booking/booking.types';
import { UserEntity } from 'services/core/user/user.entity';
import { IUserDomain, Username } from 'services/core/user/user.types';

export class BookingEntity implements IBookingDomain {
  bookingOwner: UserEntity;
  bookingOwnerId: Username;
  carNumber: string;
  bookingStartTime: BookingStartTime;
  bookingEndTime?: BookingEndTime;
  bookingNotes?: BookingNotes;
  bookingDescription?: BookingDescription;
  isFinished?: boolean;

  constructor(data: IBookingDb | ICreateBookingDto, user?: IUserDomain) {
    if (isFromNetwork(data)) {
      this.bookingStartTime = new Date(data.startDateTime * 1000);
      this.bookingEndTime = data.endDateTime
        ? new Date(data.endDateTime * 1000)
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

    this.isFinished = data.isFinished;

    if (user) {
      // todo hide some information about the user, use toDTO mapper
      this.bookingOwner = user;
    }
  }
}

function isFromNetwork(
  data: ICreateBookingDto | IBookingDb,
): data is ICreateBookingDto {
  return data.hasOwnProperty('startDateTime');
}

function isFromDb(
  data: ICreateBookingDto | IBookingDb,
): data is IBookingDb {
  return data.hasOwnProperty('startDate');
}
