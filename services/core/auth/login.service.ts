import { Maybe } from 'services/app.types';
import { LoginEntity } from 'services/core/auth/login.entity';
import { UserEntity } from 'services/core/user/user.entity';
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

  getUserFromLoginRequest = async (
    requestBody: string | undefined,
    cookies: string[] | undefined,
  ): Promise<Maybe<LoginEntity>> => {
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

      const user = await this.userRepo.getOneByUsername(username);

      if (!user) {
        return [wrongUserOrPassword, undefined];
      }

      if (user.password !== Buffer.from(password).toString('base64')) {
        return [wrongUserOrPassword, undefined];
      }

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
      const user = await this.userRepo.getOneByUsername(
        loginEntity.username,
      );

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
