import { userMapper } from 'services/core/user/user.mapper';
import { IUserDomain } from 'services/core/user/user.types';
import { FamilyCarBookingApp } from 'services/db/db.service';

export class AuthService {
  async verifyAccessToken() {}

  async getUserFromIdToken(idToken): Promise<IUserDomain> {
    const email = this.getEmailFromIdToken(idToken);

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
