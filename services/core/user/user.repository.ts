import { LoginEntity } from 'core/auth/login.entity';
import { userMapper } from 'core/user/user.mapper';
import { FamilyCarBookingApp } from 'db/db.service';
import { IUserDomain } from './user.types';

export class UserRepository {
  getOneByCredentials = async ({
    username,
  }: LoginEntity): Promise<IUserDomain | null> => {
    const userFromDb = await FamilyCarBookingApp.entities.user
      .get({ username })
      .go();

    if (!userFromDb) return null;

    return userMapper.dbToDomain(userFromDb);
  };

  updateSessionId = async (user: IUserDomain): Promise<void> => {
    await FamilyCarBookingApp.entities.user
      .update({ username: user.username })
      .set({ sessionId: user.sessionId })
      .go();
  };
}

export const userRepository = new UserRepository();
