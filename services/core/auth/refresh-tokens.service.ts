import {
  AuthenticationResultType,
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { Maybe } from 'services/app.types';
import { ValidateRefreshTokenBodyResult } from 'services/core/auth/refresh-tokens.types';
import { unauthorizedError } from './auth.errors';

export class RefreshTokensService {
  validateTokens(
    event: APIGatewayProxyEventV2WithRequestContext<any>,
  ): Maybe<ValidateRefreshTokenBodyResult> {
    const [, accessToken] =
      event.headers['authorization'].split('Bearer ');

    const idToken = event.headers['x-id-token'];
    const refreshToken = event.headers['x-refresh-token'];

    if (accessToken && idToken && refreshToken) {
      return [undefined, { accessToken, idToken, refreshToken }];
    }

    return [
      unauthorizedError,
      {
        accessToken: undefined,
        idToken: undefined,
        refreshToken: undefined,
      },
    ];
  }

  async refreshTokens({
    refreshToken,
  }): Promise<Maybe<AuthenticationResultType>> {
    const client = new CognitoIdentityProviderClient({});

    const refreshTokensCommand = new InitiateAuthCommand({
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: process.env.USER_POOL_CLIENT_ID,
    });

    try {
      const { AuthenticationResult } = await client.send(
        refreshTokensCommand,
      );

      console.log('AuthenticationResult', AuthenticationResult);

      return [undefined, AuthenticationResult];
    } catch (e) {
      console.log('error', e);
      return [e, undefined];
    }
  }
}

export const refreshTokensService = new RefreshTokensService();
