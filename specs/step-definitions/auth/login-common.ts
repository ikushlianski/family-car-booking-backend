import { UserRoles } from 'services/core/user/user.constants';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { makeRequest } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

export const givenDidNotLogInBefore = (given) => {
  given('the user did not log in previously', async function () {
    await FamilyCarBookingApp.entities.user
      .update({ username: testData.correctCreds.username })
      // @ts-ignore
      .remove(['sessionId'])
      .where((attr, op) =>
        op.eq(attr.username, testData.correctCreds.username),
      )
      .go();
  });
};

export const givenUserLoggedInBefore = (given, sessionCookie) => {
  given('the user logged in before', async function () {
    await FamilyCarBookingApp.entities.user
      .update({ username: testData.correctCreds.username })
      .set({ sessionId: testData.correctCreds.sessionId })
      .where((attr, op) =>
        op.eq(attr.username, testData.correctCreds.username),
      )
      .go();

    sessionCookie = `sessionId=${testData.correctCreds.sessionId}`;
  });
};

export const givenAlreadyRegistered = (given) => {
  given('the user is already registered', async function () {
    await FamilyCarBookingApp.entities.user
      .create({
        username: testData.correctCreds.username,
        firstName: 'Не важно',
        password: Buffer.from(testData.correctCreds.password).toString(
          'base64',
        ),
        sessionId: '',
        roles: [UserRoles.DRIVER],
        availableCarIds: [testData.familyCarId],
        providedCarIds: [],
        notifications: {
          getNotifiedWhenBookingChanged: false,
          getNotifiedWhenBookingCreated: false,
        },
        rideCompletionText: '',
      })
      .go();
  });
};

export const whenLoggingInWithCorrectCreds = (
  when,
  sessionCookie,
  loginResult,
) => {
  when('the user logs in with correct credentials', async function () {
    const { cookie, status } = await makeRequest(
      testData.loginUrl,
      testData.correctCreds,
      'POST',
      {
        Cookie: sessionCookie,
      },
    );

    loginResult.responseCookie = cookie;
    loginResult.responseStatus = status;
  });
};
