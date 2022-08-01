const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { AWS_REGION } = require('../../services/db/db.service');
const { TABLE_NAME } = require('../../services/db/db.constants');

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
  loginUrl:
    'https://xdcj0eimlj.execute-api.eu-west-1.amazonaws.com/qa/login',
  TableName: TABLE_NAME,
};
