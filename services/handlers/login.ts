import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { wrongUserOrPassword } from 'core/auth/auth.errors';
import { CookieKeys, cookieService } from 'core/auth/cookie.service';
import { loginService } from 'core/auth/login.service';
import { responderService } from 'responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [error, loginData] = loginService.getUserFromLoginRequest(
    event.body,
    event.cookies,
  );

  if (error) {
    return responderService.toErrorResponse(
      error,
      StatusCodes.BAD_REQUEST,
    );
  } else if (loginData) {
    console.log({ loginData });

    const [loginError, user] = await loginService.logIn(loginData);

    if (loginError) {
      console.log({ loginError });

      return responderService.toErrorResponse(
        wrongUserOrPassword,
        StatusCodes.UNAUTHORIZED,
      );
    }

    return user?.sessionId
      ? responderService.toSuccessResponse(
          { status: 'Success' },
          undefined,
          [
            cookieService.makeCookie(
              CookieKeys.SESSION_ID,
              user.sessionId,
            ),
          ],
        )
      : responderService.toErrorResponse(
          wrongUserOrPassword,
          StatusCodes.UNAUTHORIZED,
        );
  }

  return responderService.toErrorResponse(
    new Error('Unknown login error'),
    StatusCodes.UNAUTHORIZED,
  );
}
