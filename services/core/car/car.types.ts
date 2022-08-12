import { CarModel } from 'services/db/models/car.model';
import { EntityItem } from 'electrodb';
import { Username } from '../user/user.types';

export type CarId = string;

export interface ICarDomain {
  carId: CarId;
  username: Username;
}

export type ICarDb = EntityItem<typeof CarModel>;
