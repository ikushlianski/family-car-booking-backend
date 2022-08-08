import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';

export const thenIlyaGetsFutureEvent1 = (
  then,
  response: StepDefinitionResponse,
) => {
  then(
    'Ilya gets back a list of one item named Future Event 1',
    async () => {
      expect(response.responseBody.bookings[0].bookingDescription).toBe(
        'Ilya - future event 1',
      );
      expect(response.responseBody.bookings.length).toBe(1);
    },
  );
};
