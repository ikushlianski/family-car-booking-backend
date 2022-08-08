import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';
import {
  calculateFutureTimestampInSecs,
  makeRequest,
} from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

export const whenUserRequestsTheirOwnBookingDetails = (
  when,
  bookingResponse: StepDefinitionResponse,
  now: Date,
) => {
  when(
    /^user "(.*)" requests their own booking details on carId "(.*)" due in (\d+) days$/,
    async (
      whoRequests: string,
      carId: string,
      daysIntoTheFuture: string,
    ) => {
      const startTimeSec = calculateFutureTimestampInSecs(
        now,
        parseInt(daysIntoTheFuture, 10),
      );

      const { responseBody, status } = await makeRequest(
        `${testData.bookingsUrl}/id?username=${whoRequests}&carId=${carId}&startTime=${startTimeSec}`,
        undefined,
        'GET',
        { Cookie: `sessionId=test-session-id-${whoRequests}` },
      );

      console.log('responseBody', responseBody);

      bookingResponse.responseBody = responseBody;
      bookingResponse.responseStatus = status;
    },
  );
};
