import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { userMapper } from 'services/core/user/user.mapper';
import { IUserDomain } from 'services/core/user/user.types';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { RequestContext } from 'services/handlers/handlers.types';

export class AuthService {
  async authenticate(
    event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
  ): Promise<IUserDomain> {
    const idToken = event.headers['x-id-token'];

    if (!idToken) {
      return null;
    }

    const email = this.getEmailFromIdToken(idToken);

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
