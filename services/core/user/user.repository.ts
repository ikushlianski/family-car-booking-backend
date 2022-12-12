import { FAMILY_HONDA_CAR_NUMBER } from 'services/core/car/car.constants';
import { UserRoles } from 'services/core/user/user.constants';
import { userMapper } from 'services/core/user/user.mapper';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { IUserDomain, Username } from './user.types';

export class UserRepository {
  createUser = async ({
    username,
    availableCarIds,
    providedCarIds,
    firstName,
  }): Promise<IUserDomain | null> => {
    const userFromDb = await FamilyCarBookingApp.entities.user
      .create({
        firstName,
        notifications: undefined,
        rideCompletionText: undefined,
        roles: this.resolveUserRoles(availableCarIds, providedCarIds),
        tgEnabled: false,
        username,
        availableCarIds:
          // for simplicity of this educational app, assume Family Honda is a default car
          availableCarIds?.length === 0
            ? [FAMILY_HONDA_CAR_NUMBER]
            : availableCarIds,
        providedCarIds,
      })
      .go();

    if (!userFromDb) return null;

    return userMapper.dbToDomain(userFromDb);
  };

  getOneByUsername = async (
    username: Username,
  ): Promise<IUserDomain | null> => {
    const userFromDb = await FamilyCarBookingApp.entities.user
      .get({ username })
      .go();

    if (!userFromDb) return null;

    return userMapper.dbToDomain(userFromDb);
  };

  resolveUserRoles(
    availableCarIds: string[],
    providedCarIds: string[],
  ): UserRoles[] {
    const roles = [];

    if (availableCarIds.length) {
      roles.push(UserRoles.DRIVER);
    }

    if (providedCarIds.length) {
      roles.push(UserRoles.CAR_PROVIDER);
    }

    return roles;
  }
}

export const userRepository = new UserRepository();
