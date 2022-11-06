import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { unauthorizedError } from 'services/core/auth/auth.errors';
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
import { responderService } from 'services/responder.service';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const authenticatedUser = await cookieService.checkAuthenticated(
    event.cookies,
  );

  if (!authenticatedUser || !authenticatedUser.sessionId) {
    return responderService.toErrorResponse(
      unauthorizedError,
      StatusCodes.UNAUTHORIZED,
    );
  }

  return responderService.toSuccessResponse(
    { username: authenticatedUser.username },
    undefined,
    [
      cookieService.makeCookie(
        CookieKeys.SESSION_ID,
        authenticatedUser.sessionId,
      ),
    ],
  );
};
