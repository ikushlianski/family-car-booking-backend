import { Maybe } from 'services/app.types';
import { LoginEntity } from 'services/core/auth/login.entity';
import { SignupEntity } from 'services/core/auth/signup.types';
import { UserEntity } from 'services/core/user/user.entity';
import { userRepository, UserRepository } from '../user/user.repository';
import { SessionId } from '../user/user.types';
import { noCredentialsError, wrongUserOrPassword } from './auth.errors';
import { cookieService, CookieService } from './cookie.service';

const crypto = require('crypto');

export class SignupService {
  constructor(private userRepo: UserRepository) {}

  getUserFromSignupRequest = async (
    requestBody: string | undefined,
  ): Promise<Maybe<SignupEntity>> => {
    if (!requestBody) {
      return [noCredentialsError, undefined];
    }

    try {
      const { username, password } = JSON.parse(requestBody);

      return [undefined, { username, password }];
    } catch (e) {
      return [noCredentialsError, undefined];
    }
  };

  // logIn = async (loginEntity: LoginEntity): Promise<Maybe<UserEntity>> => {
  //   try {
  //     const user = await this.userRepo.getOneByUsername(
  //       loginEntity.usernameFromBody,
  //     );
  //
  //     if (!user.sessionId) {
  //       user.sessionId = crypto.randomUUID();
  //
  //       await this.userRepo.updateSessionId(user);
  //
  //       console.log('sessionId added to DB successfully');
  //     }
  //
  //     return [undefined, user];
  //   } catch (e) {
  //     console.error('Something went wrong when logging in', e);
  //
  //     return [wrongUserOrPassword, undefined];
  //   }
  // };
}

export const signupService = new SignupService(userRepository);
