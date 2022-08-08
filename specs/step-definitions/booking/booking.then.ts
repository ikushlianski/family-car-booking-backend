import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';

export const thenIlyaGetsFutureEvent1 = (
  then,
  response: StepDefinitionResponse,
) => {
  then(
    /^Ilya gets back a list of (\d+) items named "(.*)"$/,
    async (bookingCount: string, bookingDescription: string) => {
      console.log('response', response);

      expect(response.responseBody.bookings[0]?.bookingDescription).toBe(
        bookingDescription,
      );
      expect(response.responseBody.bookings?.length).toBe(
        parseInt(bookingCount),
      );
    },
  );
};
