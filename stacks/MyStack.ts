import { StackContext, Api, use } from '@serverless-stack/resources';
import { Database } from 'stacks/Database';

export const REST_API_NAME = `${process.env.NODE_ENV}-family-car-booking-app`;

export function MyStack({ stack }: StackContext) {
  const { table } = use(Database);

  const api = new Api(stack, REST_API_NAME, {
    defaults: {
      function: {
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          TG_API_BASE_URL: process.env.TG_API_BASE_URL,
          TG_BOT_CHAT_ID: process.env.TG_BOT_CHAT_ID,
          SWAGGER_EDITOR_URLS: process.env.SWAGGER_EDITOR_URLS,
        },
        permissions: [table],
      },
    },
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
      'GET /bookings': 'handlers/getBookingList.handler',
      'GET /bookings/id': 'handlers/getSingleBooking.handler',
      'GET /users/{id}': 'handlers/getUser.handler',
      'POST /login': 'handlers/login.handler',
      'POST /logout': 'handlers/logout.handler',
      'POST /bookings': 'handlers/createBooking.handler',
      'PATCH /bookings/id': 'handlers/editBooking.handler',
      'DELETE /bookings/id': 'handlers/deleteBooking.handler',
      'POST /bookings/finish/id': 'handlers/finishRide.handler',
      'POST /telegram/webhook': 'handlers/telegramWebhook.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  stack.addDefaultFunctionEnv({ API_URL: api.url });

  return {
    api,
  };
}
