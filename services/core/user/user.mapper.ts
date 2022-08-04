import { IUserDb, IUserDomain, IUserDto } from './user.types';

export class UserMapper {
  public domainToDb() {}

  public dbToDomain(rawDbItem: IUserDb): IUserDomain {
    return {
      username: rawDbItem.username,
      sessionId: rawDbItem.sessionId,
      roles: rawDbItem.roles,
      availableCars: rawDbItem.availableCarIds,
      providedCars: rawDbItem.providedCarIds,
      settings: {
        rideCompletionText: rawDbItem.rideCompletionText,
        notifications: {
          getNotifiedAboutBookingChanges:
            rawDbItem.notifications?.getNotifiedWhenBookingChanged,
          getNotifiedAboutNewBookings:
            rawDbItem.notifications?.getNotifiedWhenBookingCreated,
        },
      },
    };
  }

  // public domainToDTO(domainUser: IUserDomain): IUserDto {
  //   return {}
  // }
}

// export const userDomainToDb = (userDomain: IUserDomain) => {
//   const passwordInDbFormat = Buffer.from(userDomain.password).toString(
//     'base64',
//   );
//
//   console.log({ passwordInDbFormat });
//
//   return {
//     pk: `user#${userDomain.username}`,
//     sk: `user#${userDomain.username}`,
//     password: passwordInDbFormat,
//     sessionId: userDomain.sessionId,
//   };
// };

export const userMapper = new UserMapper();
