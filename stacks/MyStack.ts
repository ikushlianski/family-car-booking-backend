import { StackContext, Api, use } from '@serverless-stack/resources';
import { Database } from 'stacks/Database';

export const REST_API_NAME = `${process.env.NODE_ENV}-family-car-booking-app`;

export function MyStack({ stack }: StackContext) {
  const { table } = use(Database);

  const api = new Api(stack, REST_API_NAME, {
    defaults: {
      function: {
        environment: { NODE_ENV: process.env.NODE_ENV! },
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
      allowOrigins: ['http://localhost:3000'],
      exposeHeaders: [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
      ],
    },
    routes: {
      'GET /bookings': 'handlers/getBookingList.handler',
      'GET /bookings/id': 'handlers/getSingleBooking.handler',
      'GET /users/{id}': 'handlers/getUser.handler',
      'POST /login': 'handlers/login.handler',
      'POST /bookings': 'handlers/createBooking.handler',
      'PATCH /bookings/id': 'handlers/editBooking.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
