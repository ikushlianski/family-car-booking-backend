import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';
import { makeRequest } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

export const whenLogsInWithWrongUsername = (
  when,
  loginResult: StepDefinitionResponse,
) => {
  when('the user logs in with wrong username', async function () {
    const { responseBody, status } = await makeRequest(
      testData.loginUrl,
      testData.wrongUsernameCreds,
      'POST',
    );

    loginResult.responseBody = responseBody.status;
    loginResult.responseStatus = status;
  });
};

export const whenLogsInWithWrongPassword = (
  when,
  loginResult: StepDefinitionResponse,
) => {
  when('the user logs in with wrong password', async function () {
    const { responseBody, status } = await makeRequest(
      testData.loginUrl,
      testData.wrongPasswordCreds,
      'POST',
    );

    loginResult.responseBody = responseBody.status;
    loginResult.responseStatus = status;
  });
};

export const thenLoginErrorIsReturned = (
  then,
  loginResult: StepDefinitionResponse,
) => {
  then('login error is returned', async function () {
    expect(loginResult.responseStatus).toBe(401);
    expect(loginResult.responseBody).toBe('Wrong user or password');
  });
};
