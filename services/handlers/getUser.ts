import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { authService } from 'services/core/auth/auth.service';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import { permissionDenied } from 'services/core/booking/booking.errors';
import {
  badRequestUser,
  notFoundUser,
} from 'services/core/user/user.errors';
import { userService } from 'services/core/user/user.service';
import { StatusCodes } from 'http-status-codes';
import { RequestContext } from 'services/handlers/handlers.types';
import { responderService } from 'services/responder.service';

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
) => {
  console.log(
    'event.requestContext.authorizer',
    event.requestContext.authorizer,
  );
  const authenticatedUser = await authService.authenticate(event);

  const username = event.pathParameters.id;

  if (!username) {
    return responderService.toErrorResponse(
      badRequestUser,
      StatusCodes.BAD_REQUEST,
    );
  }

  // todo admin role will be able to request such details
  if (username !== authenticatedUser.username) {
    return responderService.toErrorResponse(
      permissionDenied,
      StatusCodes.FORBIDDEN,
    );
  }

  const user = await userService.getUser(username);

  if (!user) {
    return responderService.toErrorResponse(
      notFoundUser,
      StatusCodes.BAD_REQUEST,
    );
  }

  return responderService.toSuccessResponse({ user }, undefined, [
    cookieService.makeCookie(
      CookieKeys.SESSION_ID,
      authenticatedUser.sessionId,
    ),
  ]);
};
