import { makeRequest } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

export const whenLoggingOutWithCorrectCreds = (
  when,
  sessionCookie,
  logoutResult,
) => {
  when('the user logs out using a cookie', async function () {
    const { cookie, status } = await makeRequest(
      testData.logOutUrl,
      {},
      'POST',
      {
        Cookie: sessionCookie,
      },
    );

    logoutResult.responseCookie = cookie;
    logoutResult.responseStatus = status;
  });
};
