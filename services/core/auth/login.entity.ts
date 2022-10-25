import { SessionId } from 'services/core/user/user.types';

export class LoginEntity {
  loginSuccess: boolean;
  usernameFromBody: string;
  usernameFromDb: string;
  passwordFromBody: string;
  passwordFromDb: string;
  sessionIdFromDb: SessionId;
  sessionIdFromCookie: SessionId;

  constructor({
    usernameFromBody,
    usernameFromDb,
    passwordFromBody,
    passwordFromDb,
    sessionIdFromDb,
    sessionIdFromCookie,
    loginSuccess,
  }: any) {
    this.usernameFromBody = usernameFromBody;
    this.usernameFromDb = usernameFromDb;

    this.passwordFromBody = passwordFromBody;
    this.passwordFromDb = passwordFromDb;

    this.sessionIdFromDb = sessionIdFromDb;
    this.sessionIdFromCookie = sessionIdFromCookie;

    this.loginSuccess = loginSuccess;
  }
}
