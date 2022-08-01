import { AttributeValue } from "@aws-sdk/client-dynamodb";

export interface DynamoDBRecord {
  pk: any;
  sk: any;
}

export type RawDbItem = Record<string, AttributeValue>;
