import {
  AdminConfirmSignUpCommand,
  AdminInitiateAuthCommand,
  AuthFlowType,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { signupService } from 'services/core/auth/signup.service';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [error, { username, password }] =
    await signupService.getUserFromSignupRequest(event.body);

  const client = new CognitoIdentityProviderClient({});

  const signupCommand = new SignUpCommand({
    Username: username,
    Password: password,
    ClientId: process.env.USER_POOL_CLIENT_ID,
  });
  const { UserConfirmed } = await client.send(signupCommand);

  const confirmUserCommand = new AdminConfirmSignUpCommand({
    Username: username,
    UserPoolId: process.env.USER_POOL_ID,
  });

  await client.send(confirmUserCommand);

  const signInCommand = new AdminInitiateAuthCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID,
    AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
    UserPoolId: process.env.USER_POOL_ID,
  });

  const { AuthenticationResult } = await client.send(signInCommand);

  console.log('AuthenticationResult', AuthenticationResult);

  // if (error) {
  //   return error.message === wrongUserOrPassword.message
  //     ? responderService.toErrorResponse(error, StatusCodes.UNAUTHORIZED)
  //     : responderService.toErrorResponse(error, StatusCodes.BAD_REQUEST);
  // } else if (loginData) {
  //   console.log({ loginData });
  //
  //   const [loginError, user] = await loginService.logIn(loginData);
  //
  //   if (loginError) {
  //     console.log({ loginError });
  //
  //     return responderService.toErrorResponse(
  //       wrongUserOrPassword,
  //       StatusCodes.UNAUTHORIZED,
  //     );
  //   }
  //
  //   return user?.sessionId
  //     ? responderService.toSuccessResponse(
  //         { status: 'Success' },
  //         undefined,
  //         [
  //           cookieService.makeCookie(
  //             CookieKeys.SESSION_ID,
  //             user.sessionId,
  //           ),
  //         ],
  //       )
  //     : responderService.toErrorResponse(
  //         wrongUserOrPassword,
  //         StatusCodes.UNAUTHORIZED,
  //       );
  // }
  //
  // return responderService.toErrorResponse(
  //   new Error('Unknown login error'),
  //   StatusCodes.UNAUTHORIZED,
  // );
}
