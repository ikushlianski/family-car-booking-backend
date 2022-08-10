import {
  BookingDescription,
  BookingEndTime,
  BookingNotes,
  BookingStartTime,
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

  constructor(
    { username, carId, startTime, endTime, description }: IBookingDb,
    user?: IUserDomain,
  ) {
    this.bookingStartTime = new Date(startTime * 1000);
    this.bookingEndTime = endTime ? new Date(endTime * 1000) : undefined;
    // todo hide some information about the user, use toDTO mapper
    this.bookingOwnerId = username;
    this.carNumber = carId;
    this.bookingDescription = description;

    if (user) {
      this.bookingOwner = user;
    }
  }
}
