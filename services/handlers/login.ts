import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { wrongUserOrPassword } from 'services/core/auth/auth.errors';
import { cookieService } from 'services/core/auth/cookie.service';
import { loginService } from 'services/core/auth/login.service';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [parsingError, { username, password }] =
    await loginService.parseLoginRequest(event.body);

  if (parsingError) {
    return responderService.toErrorResponse(
      parsingError,
      StatusCodes.BAD_REQUEST,
    );
  }

  const [loginError, tokens] = await loginService.logIn({
    username,
    password,
  });

  return loginError
    ? responderService.toErrorResponse(
        wrongUserOrPassword,
        StatusCodes.UNAUTHORIZED,
      )
    : responderService.toSuccessResponse(
        {
          AccessToken: tokens.AccessToken,
          IdToken: tokens.IdToken,
          RefreshToken: tokens.RefreshToken,
        },
        undefined,
      );
}
