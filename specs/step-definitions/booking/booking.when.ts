import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';
import { makeRequest } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

export const whenIlyaRequestsHisBookings = (
  when,
  bookingResponse: StepDefinitionResponse,
) => {
  when('Ilya requests his own bookings', async () => {
    const { responseBody, status } = await makeRequest(
      `${testData.bookingsUrl}?username=ilya&carId=${testData.familyCarId}`,
      undefined,
      'GET',
      { Cookie: 'sessionId=test-session-id-ilya' },
    );

    bookingResponse.responseBody = responseBody;
    bookingResponse.responseStatus = status;
  });
};
