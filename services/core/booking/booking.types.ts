import { RolesMetadata } from 'core/auth/auth.types';
import { CarId } from 'core/car/car.types';
import { Username } from 'core/user/user.types';

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
  bookingStartTime: BookingStartTime;
  bookingEndTime: BookingEndTime;
  bookingDate: BookingDate;
  bookingOwner: BookingOwner;
  bookingNotes: BookingNotes;
}

/**
 * Booking list
 */
export interface GetBookingListServiceParams {
  username: BookingOwner;
  carId: CarId;
  weekCount?: number;
  rolesMetadata: RolesMetadata;
}

export interface GetBookingListRepositoryParams {
  username: BookingOwner;
  carId: CarId;
  from: number; // timestamp in seconds
  to: number; // timestamp in seconds
}

/**
 * Single booking
 */
export interface GetSingleBookingServiceParams {
  username: BookingOwner;
  carId: CarId;
  startTime: number;
  rolesMetadata: RolesMetadata;
}

export interface GetSingleBookingRepositoryParams {
  username: BookingOwner;
  carId: CarId;
  startTime: number;
}
