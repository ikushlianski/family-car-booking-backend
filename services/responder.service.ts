import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';

export class Responder {
  toSuccessResponse = (
    body: object,
    headers = {},
    cookies: string[] = [],
    code = StatusCodes.OK,
  ): APIGatewayProxyStructuredResultV2 => {
    return {
      statusCode: code,
      headers: {
        ...headers,
        ...this.getCorsHeaders(),
        'Content-Type': 'application/json',
      },
      isBase64Encoded: false,
      cookies,
      body: body ? JSON.stringify(body) : JSON.stringify({}),
    };
  };

  toErrorResponse = (
    error: unknown,
    code: StatusCodes,
    cookies: string[] = [],
    headers = {},
  ): APIGatewayProxyStructuredResultV2 => {
    return error instanceof Error
      ? {
          statusCode: code,
          body: JSON.stringify({ status: error.message }),
          headers: {
            ...headers,
            ...this.getCorsHeaders(),
            'Content-Type': 'application/json',
          },
          cookies,
        }
      : {
          // should not happen
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          body: JSON.stringify({ status: 'Unknown error' }),
          headers: {
            ...headers,
            ...this.getCorsHeaders(),
            'Content-Type': 'application/json',
          },
          cookies,
        };
  };

  getCorsHeaders() {
    return {
      // todo change once we have more envs
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': true,
    };
  }
}

export const responderService = new Responder();
