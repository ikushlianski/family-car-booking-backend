import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';

export class Responder {
  toSuccessResponse = (
    body: unknown,
    headers = {},
    cookies: string[] = [],
    code = StatusCodes.OK,
  ): APIGatewayProxyStructuredResultV2 => {
    const isBodyString = (body: unknown): body is string => {
      return typeof body === 'string';
    };

    return {
      statusCode: code,
      headers: {
        ...headers,
      },
      isBase64Encoded: false,
      cookies,
      // todo improve this, I don't like it now
      body: isBodyString(body)
        ? JSON.stringify({ status: body })
        : JSON.stringify(body),
    };
  };

  toErrorResponse = (
    error: unknown,
    code: StatusCodes,
    cookies: string[] = [],
  ): APIGatewayProxyStructuredResultV2 => {
    return error instanceof Error
      ? {
        statusCode: code,
        body: JSON.stringify({ status: error.message }),
        cookies,
      }
      : {
        // should not happen
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({ status: 'Unknown error' }),
        cookies,
      };
  };
}

export const responderService = new Responder();
