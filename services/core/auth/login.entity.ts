import { ILoginDto, ILoginState } from 'core/auth/auth.types';
import { SessionId } from 'core/user/user.types';

export class LoginEntity implements ILoginDto, ILoginState {
  loginSuccess: boolean;
  password: string;
  username: string;
  sessionId: SessionId;

  constructor({
    username,
    password,
    sessionId,
    loginSuccess,
  }: ILoginDto & ILoginState) {
    this.password = password;
    this.username = username;

    this.sessionId = sessionId;
    this.loginSuccess = loginSuccess;
  }

  succeed = () => {
    this.loginSuccess = true;
  };

  fail = () => {
    this.loginSuccess = false;
  };

  setSession(sessionId: SessionId) {
    this.sessionId = sessionId;
  }
}
