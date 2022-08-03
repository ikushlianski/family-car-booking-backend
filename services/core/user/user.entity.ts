import {
  IUserDb,
  IUserDomain,
  SessionId,
  Username,
} from 'core/user/user.types';

export class UserEntity implements IUserDomain {
  availableCars: string[];
  roles: string[];
  sessionId?: SessionId;
  settings: {
    rideCompletionText?: string;
    notifications: {
      getNotifiedAboutBookingChanges?: boolean;
      getNotifiedAboutNewBookings?: boolean;
    };
  };
  username: Username;

  constructor({
    username,
    roles,
    sessionId,
    availableCarIds,
    rideCompletionText,
    notifications,
  }: IUserDb) {
    this.roles = roles;
    this.availableCars = availableCarIds;
    this.username = username;
    this.sessionId = sessionId;
    this.settings = {
      rideCompletionText,
      notifications: {
        getNotifiedAboutNewBookings:
          notifications?.getNotifiedWhenBookingCreated,
        getNotifiedAboutBookingChanges:
          notifications?.getNotifiedWhenBookingChanged,
      },
    };
  }
}
