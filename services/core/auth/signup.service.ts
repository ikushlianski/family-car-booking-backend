import { Maybe } from 'services/app.types';
import { SignupFields } from 'services/core/auth/signup.types';
import { userRepository, UserRepository } from '../user/user.repository';
import { noCredentialsError } from './auth.errors';

export class SignupService {
  constructor(private userRepo: UserRepository) {}

  parseSignupRequest = async (
    requestBody: string | undefined,
  ): Promise<Maybe<SignupFields>> => {
    if (!requestBody) {
      return [noCredentialsError, undefined];
    }

    try {
      const requestFields = JSON.parse(requestBody);

      return [undefined, requestFields];
    } catch (e) {
      return [noCredentialsError, undefined];
    }
  };
}

export const signupService = new SignupService(userRepository);
