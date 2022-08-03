import { SessionId, Username } from 'core/user/user.types';

export interface ILoginData {
  username: string;
  password: string;
}

export interface ILoginSuccess {
  sessionId: string;
}

export interface CheckAuthenticatedResult {
  sessionId?: SessionId;
  user?: { username: Username; roles: string[] };
}

export interface RolesMetadata {
  currentUserRoles: string[];
  requestingOwnResource: boolean;
}
