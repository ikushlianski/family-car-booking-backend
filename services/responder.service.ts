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
        'Content-Type': 'application/json',
      },
      isBase64Encoded: false,
      cookies,
      body: JSON.stringify(body),
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
          headers: { ...headers, 'Content-Type': 'application/json' },
          cookies,
        }
      : {
          // should not happen
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          body: JSON.stringify({ status: 'Unknown error' }),
          headers: { ...headers, 'Content-Type': 'application/json' },
          cookies,
        };
  };
}

export const responderService = new Responder();
