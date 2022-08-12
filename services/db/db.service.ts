import { Service } from 'electrodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BookingModel } from 'db/models/booking.model';
import { UserModel } from 'db/models/user.model';
import { CarModel } from 'db/models/car.model';

import { TABLE_NAME } from './db.constants';

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
