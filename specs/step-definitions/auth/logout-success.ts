import assert from 'node:assert';

export const thenLogOutIsSuccessful = (then, logoutResult) => {
  then('logout is successful', function () {
    assert.strictEqual(logoutResult.responseStatus, 200);
    assert.strictEqual(
      logoutResult.responseCookie,
      'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure;',
    );
  });
};
