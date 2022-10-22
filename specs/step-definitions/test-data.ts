import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AWS_REGION } from 'services/db/db.service';
import { TABLE_NAME } from 'services/db/db.constants';

export const testData = {
  TableName: TABLE_NAME,
  client: new DynamoDBClient({ region: AWS_REGION }),
  correctCreds: {
    username: 'correct-username',
    password: 'correct-password',
    sessionId: 'valid-session-id',
  },
  familyCarId: 'ho-123456',
  strangerCarId: 'bmw-789',
  wrongUsernameCreds: {
    username: 'incorrect-username',
    password: 'correct-password',
  },
  wrongPasswordCreds: {
    username: 'correct-username',
    password: 'incorrect-password',
  },
  loginUrl: `${process.env.API_GATEWAY_ENDPOINT}/login`,
  bookingsUrl: `${process.env.API_GATEWAY_ENDPOINT}/bookings`,
};
