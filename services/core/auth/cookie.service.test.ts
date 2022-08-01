import { describe, expect, it } from 'vitest';
import { cookieService } from './cookie.service';

describe('CookieService', () => {
  describe('getSessionIdFromCookies', () => {
    it('should return abc', () => {
      const parsedCookies = [
        'mode=extreme',
        'sessionId=abc',
        'theme=dark',
      ];

      const sessionId =
        cookieService.getSessionIdFromCookies(parsedCookies);

      expect(sessionId).toBe('abc');
    });

    it('should return empty string', () => {
      const parsedCookies = ['mode=extreme', 'theme=dark'];

      const sessionId =
        cookieService.getSessionIdFromCookies(parsedCookies);

      expect(sessionId).toBe('');
    });
  });
});
