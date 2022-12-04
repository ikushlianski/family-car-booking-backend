import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { refreshTokensService } from 'services/core/auth/refresh-tokens.service';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [validationError, { accessToken, refreshToken, idToken }] =
    refreshTokensService.validateTokens(event);

  if (validationError) {
    return responderService.toErrorResponse(
      validationError,
      StatusCodes.BAD_REQUEST,
    );
  }

  return 'stub';

  // const [refreshTokensError, newTokens] =
  //   await refreshTokensService.refreshTokens({
  //     refreshToken,
  //   });
  //
  // return refreshTokensError
  //   ? responderService.toErrorResponse(
  //       wrongUserOrPassword,
  //       StatusCodes.UNAUTHORIZED,
  //     )
  //   : responderService.toSuccessResponse(
  //       {
  //         status: 'Success',
  //         accessToken: newTokens.AccessToken,
  //         idToken: newTokens.IdToken,
  //       },
  //       undefined,
  //       [
  //         cookieService.makeCookie(
  //           'refreshToken',
  //           newTokens.RefreshToken,
  //           '/',
  //           30,
  //         ),
  //       ],
  //     );
}
