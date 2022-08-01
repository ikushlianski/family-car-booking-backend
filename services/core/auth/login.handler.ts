import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import {responderService} from 'responder.service';
import { wrongUserOrPassword } from './auth.errors';
import { CookieKeys, cookieService } from './cookie.service';
import { loginService } from './login.service';

exports.handler = async function (
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [error, domainUser] = loginService.getUserFromRequest(
    event.body,
    event.cookies,
  );

  if (error) {
    return responderService.toErrorResponse(error, StatusCodes.BAD_REQUEST);
  } else if (domainUser) {
    console.log({ domainUser });
    const [loginError, loginSuccess] = await loginService.logIn(
      domainUser,
    );

    console.log({ loginSuccess });

    if (loginError) {
      console.log({ loginError });
      return responderService.toErrorResponse(
        wrongUserOrPassword,
        StatusCodes.UNAUTHORIZED,
      );
    }

    return loginSuccess
      ? responderService.toSuccessResponse('Success', undefined, [
          cookieService.makeCookie(
            CookieKeys.SESSION_ID,
            loginSuccess.sessionId,
          ),
        ])
      : responderService.toErrorResponse(
          wrongUserOrPassword,
          StatusCodes.UNAUTHORIZED,
        );
  }

  return responderService.toErrorResponse(
    new Error('Unknown login error'),
    StatusCodes.UNAUTHORIZED,
  );
};
