import { Maybe } from 'services/app.types';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { userRepository, UserRepository } from '../user/user.repository';
import { IUserDomain } from '../user/user.types';
import { logoutError } from './auth.errors';
import { cookieService, CookieService } from './cookie.service';

export class LogoutService {
  constructor(
    private userRepo: UserRepository,
    private cookieService: CookieService,
  ) {}

  getUserFromLogoutRequest = async (
    cookies: string[] | undefined,
  ): Promise<Maybe<IUserDomain>> => {
    const authenticatedUser = await this.cookieService.checkAuthenticated(
      cookies,
    );

    if (!authenticatedUser) {
      return [logoutError, undefined];
    }

    return [undefined, authenticatedUser];
  };

  logout = async (user: IUserDomain): Promise<Maybe<void>> => {
    try {
      await FamilyCarBookingApp.entities.user
        .update({ username: user.username })
        // @ts-ignore
        .remove(['sessionId'])
        .where((attr, op) => op.eq(attr.username, user.username))
        .go();

      return [undefined, undefined];
    } catch (e) {
      console.error('Something went wrong when logging out', e);

      return [logoutError, undefined];
    }
  };
}

export const logoutService = new LogoutService(
  userRepository,
  cookieService,
);
