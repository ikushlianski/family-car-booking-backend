import {
  AuthenticationResultType,
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Maybe } from 'services/app.types';
import { LoginFields } from 'services/core/auth/login.types';
import { badRequestUser } from 'services/core/user/user.errors';
import { userRepository, UserRepository } from '../user/user.repository';
import { noCredentialsError } from './auth.errors';
import { cookieService, CookieService } from './cookie.service';

export class LoginService {
  constructor(
    private userRepo: UserRepository,
    private cookieService: CookieService,
  ) {}

  parseLoginRequest = async (
    requestBody: string | undefined,
  ): Promise<Maybe<LoginFields>> => {
    if (!requestBody) {
      return [noCredentialsError, undefined];
    }

    try {
      const { username, password } = JSON.parse(requestBody);

      return [undefined, { username, password }];
    } catch (e) {
      return [badRequestUser, undefined];
    }
  };

  logIn = async ({
    username,
    password,
  }: LoginFields): Promise<Maybe<AuthenticationResultType>> => {
    const client = new CognitoIdentityProviderClient({});

    const signInCommand = new InitiateAuthCommand({
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.USER_POOL_CLIENT_ID,
    });

    try {
      const { AuthenticationResult } = await client.send(signInCommand);

      return [undefined, AuthenticationResult];
    } catch (e) {
      console.log('error', e);
      return [e, undefined];
    }
  };

  private static isPasswordCorrect(
    passwordFromDB: string,
    passwordFromBody: string,
  ) {
    return (
      passwordFromDB === Buffer.from(passwordFromBody).toString('base64')
    );
  }
}

export const loginService = new LoginService(
  userRepository,
  cookieService,
);
