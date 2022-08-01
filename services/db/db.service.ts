import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Service } from 'electrodb';

import { AWS_REGION } from '../constants';
import { TABLE_NAME } from './db.constants';
import { BookingModel } from './entities/booking';
import { CarModel } from './entities/car';
import { UserModel } from './entities/user';

const client = new DynamoDBClient({ region: AWS_REGION });

export const HondaTrackerDynamoService = new Service(
  {
    user: UserModel,
    booking: BookingModel,
    car: CarModel,
  },
  {
    client,
    table: `${TABLE_NAME}_${process.env.NODE_ENV}`,
  },
);
