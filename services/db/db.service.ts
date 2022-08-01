import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Service } from 'electrodb';

import { TABLE_NAME } from './db.constants';
import { BookingModel } from './entities/booking';
import { CarModel } from './entities/car';
import { UserModel } from './entities/user';

export const AWS_REGION = 'eu-west-1';

const client = new DynamoDBClient({ region: AWS_REGION });

export const HondaTrackerDynamoService = new Service(
  {
    user: UserModel,
    booking: BookingModel,
    car: CarModel,
  },
  {
    client,
    table: TABLE_NAME,
  },
);
