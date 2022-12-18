import {
  AdminInitiateAuthCommand,
  AuthFlowType,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { cookieService } from 'services/core/auth/cookie.service';
import { signupService } from 'services/core/auth/signup.service';
import { userRepository } from 'services/core/user/user.repository';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  const [
    error,
    { username, password, providedCarIds, availableCarIds, firstName },
  ] = await signupService.parseSignupRequest(event.body);

  if (error) {
    return responderService.toErrorResponse(error, 400);
  }

  const client = new CognitoIdentityProviderClient({});

  const signupCommand = new SignUpCommand({
    Username: username,
    Password: password,
    ClientId: process.env.USER_POOL_CLIENT_ID,
  });

  try {
    await client.send(signupCommand);
  } catch (e) {
    return responderService.toErrorResponse(e, 400);
  }

  await userRepository.createUser({
    username,
    providedCarIds,
    availableCarIds,
    firstName,
  });

  const signInCommand = new AdminInitiateAuthCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID,
    AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
    UserPoolId: process.env.USER_POOL_ID,
  });

  const {
    AuthenticationResult: { IdToken, AccessToken, RefreshToken },
  } = await client.send(signInCommand);

  return responderService.toSuccessResponse(
    { RefreshToken, IdToken, AccessToken },
    {},
  );
}
