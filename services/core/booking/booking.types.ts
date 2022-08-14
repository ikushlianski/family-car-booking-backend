import { EntityItem } from 'electrodb';
import { RolesMetadata } from 'services/core/auth/auth.types';
import { CarId } from 'services/core/car/car.types';
import { UserEntity } from 'services/core/user/user.entity';
import { IUserDomain, Username } from 'services/core/user/user.types';
import { BookingModel } from 'services/db/models/booking.model';

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
export interface ICreateBookingDto {
  username: Username;
  carId: CarId;
  startDateTime: number;
  endDateTime?: number;
  description?: string;
}

export interface IEditBookingDto {
  startDateTime?: number;
  endDateTime?: number;
  description?: string;
}

export interface IGetBookingDto {
  bookingOwnerId: Username;
  carNumber: CarId;
  bookingStartTime: number;
  bookingEndTime?: number;
  bookingDescription?: string;
  bookingNotes?: BookingNotes;
}

/**
 * Domain layer
 */
export interface IBookingDomain {
  bookingOwnerId: Username;
  carNumber: CarId;
  bookingStartTime: BookingStartTime;
  bookingEndTime?: BookingEndTime;
  bookingDescription?: string;
  bookingOwner?: IUserDomain;
  bookingNotes?: BookingNotes;
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

export interface CheckBookingExistsRepositoryParams {
  username: Username;
  carId: CarId;
  startTime: number;
}

export interface SaveSingleBookingRepositoryParams
  extends IBookingDomain {}

export interface EditBookingRepositoryParams {
  username: Username;
  carId: CarId;
  startTime: string;
  dataToEdit: IEditBookingDto;
}

export interface DeleteBookingRepositoryParams {
  username: Username;
  carId: CarId;
  startTime: string;
}
