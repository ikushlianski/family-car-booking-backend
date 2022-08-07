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

export const givenAlreadyRegistered = (given) => {
  given('the user is already registered', async function () {
    await FamilyCarBookingApp.entities.user
      .create({
        username: testData.correctCreds.username,
        password: Buffer.from(testData.correctCreds.password).toString(
          'base64',
        ),
        sessionId: '',
        roles: [UserRoles.DRIVER],
        availableCarIds: [testData.familyCarId],
        providedCarIds: [],
        notifications: {
          getNotifiedWhenBookingChanged: true,
          getNotifiedWhenBookingCreated: true,
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
