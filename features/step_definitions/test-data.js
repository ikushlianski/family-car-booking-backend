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
  // todo replace this with env variable
  loginUrl: 'https://hu2oeryjs4.execute-api.eu-west-1.amazonaws.com/login',
  TableName: TABLE_NAME,
};
