import assert from 'node:assert';

export const thenLoginIsSuccessful = (then, loginResult) => {
  then('login is successful', function () {
    assert.strictEqual(loginResult.responseStatus, 200);
  });
};
