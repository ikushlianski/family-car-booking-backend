import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';

export const thenIlyaGetsFutureEvent1 = (
  then,
  { responseBody }: StepDefinitionResponse,
) => {
  then(
    'Ilya gets back a list of one item named Future Event 1',
    async () => {
      expect(responseBody[0].description).toBe('Future Event 1');
      expect(responseBody.bookings.length).toBe(1);
    },
  );
};
