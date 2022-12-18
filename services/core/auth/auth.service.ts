import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { userMapper } from 'services/core/user/user.mapper';
import { IUserDomain } from 'services/core/user/user.types';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { RequestContext } from 'services/handlers/handlers.types';

export class AuthService {
  async authenticate(
    event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
  ): Promise<IUserDomain> {
    const [, accessToken] =
      event.headers['authorization']?.split('Bearer ');

    if (!accessToken) {
      return null;
    }

    const client = new CognitoIdentityProviderClient({});

    const { UserAttributes } = await client.send(
      new GetUserCommand({
        AccessToken: accessToken,
      }),
    );

    const [{ Value: email }] = UserAttributes.filter(
      (attr) => attr.Name === 'email',
    );

    return this.getUserByEmail(email);
  }

  private async getUserByEmail(email: string): Promise<IUserDomain> {
    const userFromDb = await FamilyCarBookingApp.entities.user
      .get({ username: email })
      .go();

    return userMapper.dbToDomain(userFromDb);
  }

  private getEmailFromIdToken(token) {
    const [, payload] = token.split('.');
    const { email } = JSON.parse(
      Buffer.from(payload, 'base64').toString('ascii'),
    );

    return email;
  }
}

export const authService = new AuthService();
