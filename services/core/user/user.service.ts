import { userRepository } from 'core/user/user.repository';
import { IUserDomain, Username } from 'core/user/user.types';

export class UserService {
  getUser = (username: Username): Promise<IUserDomain> => {
    return userRepository.getOneByUsername(username);
  };
}

export const userService = new UserService();
