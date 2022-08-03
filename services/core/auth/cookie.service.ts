import { FamilyCarBookingApp } from 'db/db.service';
import { SessionId } from '../user/user.types';

export enum CookieKeys {
  SESSION_ID = 'sessionId',
}

export class CookieService {
  public getSessionIdFromCookies = (cookies: string[]): SessionId => {
    return cookies.reduce((acc: SessionId, cookieString) => {
      const [key, value] = cookieString.split('=');

      if (key === CookieKeys.SESSION_ID) {
        acc = value;
      }

      return acc;
    }, '');
  };

  public checkAuthenticated = async (
    cookies: string[] | undefined,
  ): Promise<SessionId | undefined> => {
    if (!cookies) return undefined;

    const sessionIdFromCookies = this.getSessionIdFromCookies(cookies);

    const [{ sessionId: sessionIdFromDb }] =
      await FamilyCarBookingApp.entities.user.query
        .getUserBySessionId({ sessionId: sessionIdFromCookies })
        .go();

    return sessionIdFromDb;
  };

  public makeCookie = (key: string, value: string) => {
    return `${key}=${value}`;
  };
}

export const cookieService = new CookieService();
