import { LoginResult } from 'specs/step-definitions/auth/login.types';
import { testData } from 'specs/step-definitions/test-data';

import { makeRequest } from './login.utils';

export const whenLogsInWithWrongUsername = (
  when,
  loginResult: LoginResult,
) => {
  when('the user logs in with wrong username', async function () {
    const { responseBody, status } = await makeRequest(
      testData.wrongUsernameCreds,
      'POST',
    );

    loginResult.responseBody = responseBody.status;
    loginResult.responseStatus = status;
  });
};

export const whenLogsInWithWrongPassword = (
  when,
  loginResult: LoginResult,
) => {
  when('the user logs in with wrong password', async function () {
    const { responseBody, status } = await makeRequest(
      testData.wrongPasswordCreds,
      'POST',
    );

    loginResult.responseBody = responseBody.status;
    loginResult.responseStatus = status;
  });
};

export const thenLoginErrorIsReturned = (
  then,
  loginResult: LoginResult,
) => {
  then('login error is returned', async function () {
    expect(loginResult.responseStatus).toBe(401);
    expect(loginResult.responseBody).toBe('Wrong user or password');
  });
};
