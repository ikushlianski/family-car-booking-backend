import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';

export const thenUserGetsAnyEligibleFutureEvent = (
  then,
  response: StepDefinitionResponse,
) => {
  then(
    /^user "(.*)" gets back a booking named "(.*)"$/,
    async (username: string, bookingDescription: string) => {
      expect(response.responseBody.booking.bookingDescription).toBe(
        bookingDescription,
      );
    },
  );
};
