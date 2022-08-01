const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { TABLE_NAME } = require('../../services/db/db.constants');
const { AWS_REGION } = require('../../services/db/db.service');

module.exports = {
  client: new DynamoDBClient({ region: AWS_REGION }),
  correctCreds: {
    username: 'correct-username',
    password: 'correct-password',
    sessionId: 'valid-session-id',
  },
  wrongUsernameCreds: {
    username: 'incorrect-username',
    password: 'correct-password',
  },
  wrongPasswordCreds: {
    username: 'correct-username1',
    password: 'incorrect-password',
  },
  loginUrl: `${process.env.API_GATEWAY_ENDPOINT}/login`,
  TableName: TABLE_NAME,
};
