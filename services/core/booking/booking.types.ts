import { RolesMetadata } from 'core/auth/auth.types';
import { CarId } from 'core/car/car.types';
import { UserEntity } from 'core/user/user.entity';
import { IUserDomain, Username } from 'core/user/user.types';
import { BookingModel } from 'db/models/booking.model';
import { EntityItem } from 'electrodb';

/**
 * Fields
 */
export type BookingStartTime = Date;
export type BookingEndTime = Date;
export type BookingDescription = string;
export type BookingNotes = {
  carParkLocationText: string;
  carParkLongitude: string;
  carParkLatitude: string;
};

/**
 * DTO
 */
export interface CreateBookingDto {
  username: Username;
  carId: CarId;
  startDateTime: string;
  endDateTime?: string;
  description?: string;
}

/**
 * Domain layer
 */
export interface IBookingDomain {
  bookingStartTime: BookingStartTime;
  bookingEndTime?: BookingEndTime;
  bookingOwner: IUserDomain;
  bookingNotes?: BookingNotes;
  carNumber: CarId;
}

/**
 * Storage layer
 */
export type IBookingDb = EntityItem<typeof BookingModel>;

/**
 * Service layer
 */
export interface GetBookingListByUserServiceParams {
  user: UserEntity;
  carId: CarId;
  weekCount?: number;
  rolesMetadata: RolesMetadata;
}

export interface GetSingleBookingServiceParams {
  user: UserEntity;
  carId: CarId;
  startTime: number;
  rolesMetadata: RolesMetadata;
}

/**
 * Repository layer
 */
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

export interface GetSingleBookingRepositoryParams {
  user: UserEntity;
  carId: CarId;
  startTime: number;
}
