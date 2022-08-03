import { SessionId, Username } from 'core/user/user.types';

export interface ILoginDto {
  username: string;
  password: string;
}

export interface ILoginState {
  sessionId: string;
  loginSuccess: boolean;
}

export interface CheckAuthenticatedResult {
  sessionId?: SessionId;
  user?: { username: Username; roles: string[] };
}

export interface RolesMetadata {
  currentUserRoles: string[];
  requestingOwnResource: boolean;
  requestingForUser?: string;
}
