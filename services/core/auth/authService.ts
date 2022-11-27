import { userMapper } from 'services/core/user/user.mapper';
import { IUserDomain } from 'services/core/user/user.types';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { Claims } from 'services/handlers/handlers.types';

export class AuthService {
  async getUserByJwtClaims({ email }: Claims): Promise<IUserDomain> {
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
