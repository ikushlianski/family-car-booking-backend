import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  // get refresh token in cookie
  // revoke that token
  // if (error || !user) {
  //   return responderService.toErrorResponse(
  //     error,
  //     StatusCodes.UNAUTHORIZED,
  //   );
  // }
  //
  // const [logoutError] = await logoutService.logout(user);
  //
  // return logoutError
  //   ? responderService.toErrorResponse(
  //       logoutError,
  //       StatusCodes.UNAUTHORIZED,
  //     )
  //   : responderService.toSuccessResponse(undefined, undefined, [
  //       cookieService.buildCookieToBeRemoved(CookieKeys.SESSION_ID),
  //     ]);
}
