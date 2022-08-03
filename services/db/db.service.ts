import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Service } from 'electrodb';

import { TABLE_NAME } from './db.constants';
import { BookingModel } from './models/booking';
import { CarModel } from './models/car';
import { UserModel } from './models/user';

export const AWS_REGION = 'eu-west-1';

export const dynamoDBClient = new DynamoDBClient({ region: AWS_REGION });

export const FamilyCarBookingApp = new Service(
  {
    user: UserModel,
    booking: BookingModel,
    car: CarModel,
  },
  {
    client: dynamoDBClient,
    table: TABLE_NAME,
  },
);
