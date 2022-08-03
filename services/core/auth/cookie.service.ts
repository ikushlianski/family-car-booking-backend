import { FamilyCarBookingApp } from 'db/db.service';
import { UserModel } from 'db/entities/user';
import { EntityItem } from 'electrodb';
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
  ): Promise<EntityItem<typeof UserModel> | false> => {
    if (!cookies) return false;

    const sessionIdFromCookies = this.getSessionIdFromCookies(cookies);

    const [user] = await FamilyCarBookingApp.entities.user.query
      .getUserBySessionId({ sessionId: sessionIdFromCookies })
      .go();

    return user;
  };

  public makeCookie = (key: string, value: string) => {
    return `${key}=${value}`;
  };
}

export const cookieService = new CookieService();
