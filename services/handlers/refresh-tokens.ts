import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { refreshTokensService } from 'services/core/auth/refresh-tokens.service';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [validationError, { refreshToken }] =
    refreshTokensService.validateTokens(event);

  if (validationError) {
    return responderService.toErrorResponse(
      validationError,
      StatusCodes.BAD_REQUEST,
    );
  }

  const [refreshTokenError, result] =
    await refreshTokensService.refreshTokens({ refreshToken });

  if (refreshTokenError) {
    return responderService.toErrorResponse(
      refreshTokenError,
      StatusCodes.BAD_REQUEST,
    );
  }

  if (!result) {
    return responderService.toErrorResponse(
      refreshTokenError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return responderService.toSuccessResponse(
    { IdToken: result.IdToken, AccessToken: result.AccessToken },
    {},
  );
}
