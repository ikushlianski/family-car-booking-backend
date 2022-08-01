export type Username = string;
export type Password = string;
export type SessionId = string;

export interface IUserDomain {
  username: Username;
  password: Password;
  sessionId?: SessionId;
}
