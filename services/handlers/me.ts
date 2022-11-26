import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { authService } from 'services/core/auth/authService';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import { responderService } from 'services/responder.service';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const authenticatedUser = await authService.getUserFromIdToken(
    event.headers.authorization,
  );

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
