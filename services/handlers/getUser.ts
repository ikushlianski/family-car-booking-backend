import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { unauthorizedError } from 'core/auth/auth.errors';
import { CookieKeys, cookieService } from 'core/auth/cookie.service';
import { badRequestUser, notFoundUser } from 'core/user/user.errors';
import { userService } from 'core/user/user.service';
import { StatusCodes } from 'http-status-codes';
import { responderService } from 'responder.service';

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

  const username = event.pathParameters.id;

  if (!username) {
    return responderService.toErrorResponse(
      badRequestUser,
      StatusCodes.BAD_REQUEST,
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
    cookieService.makeCookie(CookieKeys.SESSION_ID, user.sessionId),
  ]);
};
