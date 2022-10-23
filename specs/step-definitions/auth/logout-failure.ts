import { FamilyCarBookingApp } from 'services/db/db.service';
import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';
import { makeRequest } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

export const whenLoggingOutWithoutCreds = (
  when,
  logoutResult: StepDefinitionResponse,
) => {
  when('the user logs out without a cookie', async function () {
    const { responseBody, status } = await makeRequest(
      testData.logOutUrl,
      undefined,
      'POST',
    );

    logoutResult.responseBody = responseBody.status;
    logoutResult.responseStatus = status;
  });
};

export const thenLogoutErrorIsReturned = (
  then,
  logoutResult: StepDefinitionResponse,
) => {
  then('logout is unsuccessful', async function () {
    expect(logoutResult.responseStatus).toBe(401);
  });
};

export const thenUserRetainsTheirSessionId = (then) => {
  then('user retains their sessionId', async function () {
    const user = await FamilyCarBookingApp.entities.user
      .get({ username: testData.correctCreds.username })
      .go();

    expect(user.sessionId).toBe(testData.correctCreds.sessionId);
  });
};
