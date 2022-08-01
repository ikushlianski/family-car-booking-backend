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
      gsi1pk: 'string',
      gsi1sk: 'string',
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
    globalIndexes: {
      gsi1: {
        partitionKey: 'gsi1pk',
        sortKey: 'gsi1sk',
      },
    },
  });

  return {
    table,
  };
}
