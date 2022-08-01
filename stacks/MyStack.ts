import { StackContext, Api } from '@serverless-stack/resources';

export const REST_API_NAME = `${process.env.NODE_ENV}-family-car-booking-app`;

export function MyStack({ stack }: StackContext) {
  const api = new Api(stack, REST_API_NAME, {
    routes: {
      'GET /': 'handlers/lambda.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
