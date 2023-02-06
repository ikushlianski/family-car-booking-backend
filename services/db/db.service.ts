import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Service } from 'electrodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BookingModel } from 'services/db/models/booking.model';
import { CarModel } from 'services/db/models/car.model';
import { UserModel } from 'services/db/models/user.model';

import { TABLE_NAME } from './db.constants';

export const AWS_REGION = 'eu-west-1';

export const client = new DynamoDBClient({ region: AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export const FamilyCarBookingApp = new Service(
  {
    user: UserModel,
    booking: BookingModel,
    car: CarModel,
  },
  {
    client: documentClient,
    table: TABLE_NAME,
  },
);
