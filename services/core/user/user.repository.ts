import { userMapper } from 'services/core/user/user.mapper';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { IUserDomain, Username } from './user.types';

export class UserRepository {
  getOneByUsername = async (
    username: Username,
  ): Promise<IUserDomain | null> => {
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

  removeSessionId = async (user: IUserDomain): Promise<void> => {
    await FamilyCarBookingApp.entities.user
      .update({ username: user.username })
      .set({ sessionId: user.sessionId })
      .go();
  };
}

export const userRepository = new UserRepository();
