import { StackContext, Table } from '@serverless-stack/resources';
import { RemovalPolicy } from 'aws-cdk-lib';
import { TABLE_NAME } from 'services/db/db.constants';

export function Database({ stack }: StackContext) {
  const table = new Table(stack, TABLE_NAME, {
    cdk: {
      table: {
        tableName: TABLE_NAME,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
    fields: {
      pk: 'string',
      sk: 'string',
      gsi1pk: 'string', // get-user-by-session-id
      gsi1sk: 'string', // get-user-by-session-id
      gsi2pk: 'string', // get-booking-by-car-id
      gsi2sk: 'string', // get-booking-by-car-id
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
    globalIndexes: {
      'get-user-by-session-id': {
        partitionKey: 'gsi1pk',
        sortKey: 'gsi1sk',
      },
      'get-bookings-by-car': {
        partitionKey: 'gsi2pk',
        sortKey: 'gsi2sk',
      },
    },
  });

  return {
    table,
  };
}
