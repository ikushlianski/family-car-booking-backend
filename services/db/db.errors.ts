import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb/dist-types/models/DynamoDBServiceException";

export const getDbError = (error: DynamoDBServiceException) =>
  new Error(error.message);
