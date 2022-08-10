import { RolesMetadata } from 'core/auth/auth.types';
import { CarId } from 'core/car/car.types';
import { UserEntity } from 'core/user/user.entity';
import { IUserDomain } from 'core/user/user.types';
import { BookingModel } from 'db/models/booking';
import { EntityItem } from 'electrodb';

export type BookingStartTime = Date;
export type BookingEndTime = Date;
export type BookingDescription = string;
export type BookingNotes = {
  carParkLocationText: string;
  carParkLongitude: string;
  carParkLatitude: string;
};

export interface IBookingDomain {
  bookingStartTime: BookingStartTime;
  bookingEndTime?: BookingEndTime;
  bookingOwner: IUserDomain;
  bookingNotes?: BookingNotes;
  carNumber: CarId;
}

export type IBookingDb = EntityItem<typeof BookingModel>;

/**
 * Booking list
 */
export interface GetBookingListByUserServiceParams {
  user: UserEntity;
  carId: CarId;
  weekCount?: number;
  rolesMetadata: RolesMetadata;
}

export interface GetBookingListByUserRepositoryParams {
  user: UserEntity;
  carId: CarId;
  from: number; // timestamp in seconds
  to: number; // timestamp in seconds
}

export interface GetBookingListByCarIdRepositoryParams {
  carId: CarId;
  from: number; // timestamp in seconds
  to: number; // timestamp in seconds
}

/**
 * Single booking
 */
export interface GetSingleBookingServiceParams {
  user: UserEntity;
  carId: CarId;
  startTime: number;
  rolesMetadata: RolesMetadata;
}

export interface GetSingleBookingRepositoryParams {
  user: UserEntity;
  carId: CarId;
  startTime: number;
}
