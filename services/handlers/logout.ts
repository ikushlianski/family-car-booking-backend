import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import { logoutService } from 'services/core/auth/logout.service';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [error, user] = await logoutService.getUserFromLogoutRequest(
    event.cookies,
  );

  if (error || !user) {
    return responderService.toErrorResponse(
      error,
      StatusCodes.UNAUTHORIZED,
    );
  }

  const [logoutError] = await logoutService.logout(user);

  return logoutError
    ? responderService.toErrorResponse(
        logoutError,
        StatusCodes.UNAUTHORIZED,
      )
    : responderService.toSuccessResponse(undefined, undefined, [
        cookieService.buildCookieToBeRemoved(CookieKeys.SESSION_ID),
      ]);
}
