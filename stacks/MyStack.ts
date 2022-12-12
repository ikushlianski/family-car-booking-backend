import {
  StackContext,
  Api,
  use,
  Cognito,
} from '@serverless-stack/resources';
import { Database } from 'stacks/Database';

export const REST_API_NAME = `${process.env.NODE_ENV}-family-car-booking-app`;

export function MyStack({ stack }: StackContext) {
  const { table } = use(Database);

  const hostedZone = 'ilya.online';
  const domainName = `${stack.stage}-car-tracker.${hostedZone}`;

  const auth = new Cognito(stack, 'Auth', {
    login: ['email'],
    triggers: {
      preSignUp: 'triggers/pre-sign-up.handler',
    },
    cdk: {
      userPoolClient: {
        authFlows: {
          userPassword: true,
          adminUserPassword: true,
        },
      },
      userPool: {
        passwordPolicy: {
          // complex password would be required in a real app
          minLength: 6,
          requireLowercase: false,
          requireUppercase: false,
          requireDigits: false,
          requireSymbols: false,
        },
      },
    },
  });

  const api = new Api(stack, REST_API_NAME, {
    authorizers: {
      UserPoolAuthorizer: {
        type: 'user_pool',
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: 'UserPoolAuthorizer',
      function: {
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          TG_API_BASE_URL: process.env.TG_API_BASE_URL,
          TG_BOT_CHAT_ID: process.env.TG_BOT_CHAT_ID,
          SWAGGER_EDITOR_URLS: process.env.SWAGGER_EDITOR_URLS,
          USER_POOL_CLIENT_ID: auth.userPoolClientId,
          COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId,
          USER_POOL_ID: auth.userPoolId,
        },
        permissions: [table],
      },
    },
    customDomain: domainName,
    cors: {
      allowCredentials: true,
      allowMethods: [
        'GET',
        'POST',
        'PATCH',
        'PUT',
        'DELETE',
        'HEAD',
        'OPTIONS',
      ],
      // todo change when we have more envs
      //  also see lambda responses
      allowOrigins: [
        'http://localhost:3000',
        ...(process.env.SWAGGER_EDITOR_URLS?.split(',') || []),
      ],
      allowHeaders: ['Content-Type', 'api_key', 'Authorization'],
      exposeHeaders: [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Headers',
        'Content-Type',
        'api_key',
        'Authorization',
        'Set-Cookie',
      ],
    },
    routes: {
      // AUTH
      'POST /signup': {
        authorizer: 'none',
        function: 'handlers/signup.handler',
      },
      'POST /login': {
        authorizer: 'none',
        function: 'handlers/login.handler',
      },
      'POST /logout': 'handlers/logout.handler',
      'POST /token/refresh': 'handlers/refresh-tokens.handler',

      // APP
      'GET /bookings': 'handlers/getBookingList.handler',
      'GET /bookings/id': 'handlers/getSingleBooking.handler',
      'GET /users/{id}': 'handlers/getUser.handler',
      'GET /me': 'handlers/me.handler',
      'POST /bookings': 'handlers/createBooking.handler',
      'PATCH /bookings/id': 'handlers/editBooking.handler',
      'DELETE /bookings/id': 'handlers/deleteBooking.handler',
      'POST /bookings/finish/id': 'handlers/finishRide.handler',
      'POST /telegram/webhook': 'handlers/telegramWebhook.handler',
    },
  });

  auth.attachPermissionsForAuthUsers(auth, [api, 's3', 'dynamodb']);
  api.attachPermissions(['s3', 'dynamodb', 'cognito-idp']);

  const {
    userPoolClientId,
    cognitoIdentityPoolId,
    userPoolId,
    userPoolArn,
  } = auth;

  stack.addOutputs({
    apiEndpoint: api.url,
    userPoolClientId,
    cognitoIdentityPoolId,
    userPoolId,
    userPoolArn,
  });

  stack.addDefaultFunctionEnv({ API_URL: api.url });

  return {
    api,
  };
}
