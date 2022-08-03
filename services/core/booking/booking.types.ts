import { CarId } from 'core/car/car.types';
import { Username } from 'core/user/user.types';

export type BookingId = {
  username: BookingOwner;
  carId: CarId;
  startTime: number;
};

export type GetBookingListOptions = {
  username: BookingOwner;
  carId: CarId;
  weekCount?: number;
};

export type BookingStartTime = number;
export type BookingEndTime = number;
export type BookingDate = Date;
export type BookingOwner = Username;
export type BookingNotes = {
  carParkLocationText: string;
  carParkLongitude: string;
  carParkLatitude: string;
};

export interface IBookingDomain {
  bookingId: BookingId;
  bookingStartTime: BookingStartTime;
  bookingEndTime: BookingEndTime;
  bookingDate: BookingDate;
  bookingOwner: BookingOwner;
  bookingNotes: BookingNotes;
}
