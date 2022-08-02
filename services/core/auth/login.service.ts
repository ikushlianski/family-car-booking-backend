import { Maybe } from 'app.types';
import { userRepository, UserRepository } from '../user/user.repository';
import { IUserDomain, SessionId } from '../user/user.types';
import { noCredentialsError, wrongUserOrPassword } from './auth.errors';
import { ILoginSuccess } from './auth.types';
import { cookieService, CookieService } from './cookie.service';

const crypto = require('crypto');

export class LoginService {
  constructor(
    private userRepo: UserRepository,
    private cookieService: CookieService,
  ) {}

  getUserFromLoginRequest = (
    requestBody: string | undefined,
    cookies: string[] | undefined,
  ): Maybe<IUserDomain> => {
    if (!requestBody) {
      return [noCredentialsError, undefined];
    }

    let sessionId: SessionId = '';

    if (cookies) {
      sessionId = this.cookieService.getSessionIdFromCookies(cookies);

      console.log('sessionId from request', sessionId);
    }

    try {
      const { username, password } = JSON.parse(requestBody);

      if (username && password) {
        const userFromDomain: IUserDomain = {
          username,
          password,
          sessionId,
        };

        return [undefined, userFromDomain];
      }

      return [wrongUserOrPassword, undefined];
    } catch (e) {
      return [noCredentialsError, undefined];
    }
  };

  logIn = async (
    domainUser: IUserDomain,
  ): Promise<Maybe<ILoginSuccess>> => {
    try {
      const userFromDB = await this.userRepo.getOneByCredentials(
        domainUser,
      );

      console.log({ userFromDB });

      if (!userFromDB) {
        return [wrongUserOrPassword, undefined];
      }

      if (!userFromDB.sessionId) {
        userFromDB.sessionId = crypto.randomUUID();

        await this.userRepo.updateSessionId(userFromDB);

        console.log('sessionId updated successfully');

        const loginSuccess: ILoginSuccess = {
          sessionId: userFromDB.sessionId!,
        };

        return [undefined, loginSuccess];
      }

      const loginSuccess: ILoginSuccess = {
        sessionId: userFromDB.sessionId,
      };

      return domainUser.sessionId === userFromDB.sessionId
        ? [undefined, loginSuccess]
        : [wrongUserOrPassword, undefined];
    } catch (e) {
      console.error('Something went wrong when logging in', e);

      return [wrongUserOrPassword, undefined];
    }
  };
}

export const loginService = new LoginService(
  userRepository,
  cookieService,
);
