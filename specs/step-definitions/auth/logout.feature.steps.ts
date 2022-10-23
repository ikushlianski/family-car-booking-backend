import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  givenAlreadyRegistered,
  givenUserLoggedInBefore,
} from 'specs/step-definitions/auth/login-common';
import { whenLoggingOutWithCorrectCreds } from 'specs/step-definitions/auth/logout-common';
import {
  thenLogoutErrorIsReturned,
  thenUserRetainsTheirSessionId,
  whenLoggingOutWithoutCreds,
} from 'specs/step-definitions/auth/logout-failure';
import { thenLogOutIsSuccessful } from 'specs/step-definitions/auth/logout-success';
import { removeAllData } from 'specs/step-definitions/hooks';
import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';
import { testData } from 'specs/step-definitions/test-data';

const feature = loadFeature('./specs/features/logout.feature');

let sessionCookie = `sessionId=${testData.correctCreds.sessionId}`;

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await removeAllData();
  });

  afterAll(async () => {
    await removeAllData();
  });

  test('Successful logout', async ({ given, when, then }) => {
    givenAlreadyRegistered(given);

    givenUserLoggedInBefore(given, sessionCookie);

    const logoutResult = {
      responseCookie: undefined,
      responseStatus: undefined,
    };

    whenLoggingOutWithCorrectCreds(when, sessionCookie, logoutResult);

    thenLogOutIsSuccessful(then, logoutResult);
  });

  test('Unsuccessful logout - user tries to log out without a cookie', ({
    given,
    when,
    then,
  }) => {
    givenAlreadyRegistered(given);

    givenUserLoggedInBefore(given, sessionCookie);

    const logoutResult: StepDefinitionResponse = {
      responseCookie: undefined,
      responseStatus: undefined,
      responseBody: undefined,
    };

    whenLoggingOutWithoutCreds(when, logoutResult);

    thenLogoutErrorIsReturned(then, logoutResult);

    thenUserRetainsTheirSessionId(then);
  });
});
