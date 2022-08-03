import { Maybe } from 'app.types';
import { LoginEntity } from 'core/auth/login.entity';
import { UserEntity } from 'core/user/user.entity';
import { userRepository, UserRepository } from '../user/user.repository';
import { SessionId } from '../user/user.types';
import { noCredentialsError, wrongUserOrPassword } from './auth.errors';
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
  ): Maybe<LoginEntity> => {
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
        const login = new LoginEntity({
          username,
          sessionId,
          password,
          loginSuccess: false,
        });

        return [undefined, login];
      }

      return [wrongUserOrPassword, undefined];
    } catch (e) {
      return [noCredentialsError, undefined];
    }
  };

  logIn = async (loginEntity: LoginEntity): Promise<Maybe<UserEntity>> => {
    try {
      const user = await this.userRepo.getOneByCredentials(loginEntity);

      console.log({ user });

      if (!user) {
        loginEntity.fail();

        return [wrongUserOrPassword, undefined];
      }

      if (!user.sessionId) {
        user.sessionId = crypto.randomUUID();

        await this.userRepo.updateSessionId(user);

        console.log('sessionId updated successfully');

        return [undefined, user];
      }

      return loginEntity.sessionId === user.sessionId
        ? [undefined, user]
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
