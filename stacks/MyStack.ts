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
    routes: {
      'GET /': 'handlers/lambda.handler',
      'POST /login': 'handlers/login.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
