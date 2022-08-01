import {HondaTrackerDynamoService} from 'db/db.service';
import { IUserDomain } from './user.types';

export class UserRepository {
  getOneByCredentials = async (
    domainUser: IUserDomain,
  ): Promise<IUserDomain | null> => {
    return await HondaTrackerDynamoService.entities.user
      .get({ username: domainUser.username })
      .go();
  };

  updateSessionId = async (_user: IUserDomain): Promise<void> => {
    await HondaTrackerDynamoService.entities.user
      .update({ username: _user.username })
      .set({ sessionId: _user.sessionId })
      .go();
  };
}

export const userRepository = new UserRepository();
