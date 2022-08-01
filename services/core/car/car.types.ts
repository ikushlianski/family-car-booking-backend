import { Username } from '../user/user.types';

export type CarId = string;

export interface ICarDomain {
  carId: CarId;
  username: Username;
}
