import { StepDefinitionResponse } from 'specs/step-definitions/step-definition.types';

export const thenIlyaGetsFutureEvent1 = (
  then,
  response: StepDefinitionResponse,
) => {
  then(
    /^Ilya gets back a list of (\d+) items named "(.*)"$/,
    async (bookingCount: string, bookingDescription: string) => {
      expect(response.responseBody.bookings[0]?.bookingDescription).toBe(
        bookingDescription,
      );
      expect(response.responseBody.bookings?.length).toBe(
        parseInt(bookingCount),
      );
    },
  );
};

export const thenIlyaGetsEventsUpTo2WeeksAhead = (
  then,
  response: StepDefinitionResponse,
) => {
  then(
    /^Ilya gets back a list of (\d+) items$/,
    async (itemCount: string) => {
      expect(response.responseBody.bookings?.length).toBe(
        parseInt(itemCount),
      );
    },
  );
};

export const thenItemXNameIsY = (
  then,
  response: StepDefinitionResponse,
) => {
  then(
    /^item (\d+) is called "(.*)"$/,
    async (bookingOrderNum: string, bookingDescription: string) => {
      expect(
        response.responseBody.bookings?.[parseInt(bookingOrderNum)]
          .bookingDescription,
      ).toBe(bookingDescription);
    },
  );
};
