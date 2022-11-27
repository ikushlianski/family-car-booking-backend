import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { authService } from 'services/core/auth/authService';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import { RequestContext } from 'services/handlers/handlers.types';
import { responderService } from 'services/responder.service';

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
) => {
  const authenticatedUser = await authService.getUserByJwtClaims(
    event.requestContext.authorizer.jwt.claims,
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
