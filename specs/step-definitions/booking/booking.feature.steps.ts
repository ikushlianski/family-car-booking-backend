import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  givenIlyaHasFutureEvent,
  givenIlyaIsRegistered,
  givenPapaIsRegistered,
  givenStrangerIsRegistered,
} from 'specs/step-definitions/booking/booking.given';
import { thenIlyaGetsFutureEvent1 } from 'specs/step-definitions/booking/booking.then';
import { whenIlyaRequestsHisBookings } from 'specs/step-definitions/booking/booking.when';
import { removeAllData } from 'specs/step-definitions/hooks';
import { initTestResponseObject } from 'specs/step-definitions/step-definition.utils';

const feature = loadFeature('./specs/features/bookingList.feature');

function setupBackground(given) {
  givenPapaIsRegistered(given);
  givenIlyaIsRegistered(given);
  givenStrangerIsRegistered(given);
}

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await removeAllData();
  });

  afterAll(async () => {
    await removeAllData();
  });

  test('Ilya requests his own booking list', async ({
    given,
    when,
    then,
  }) => {
    setupBackground(given);

    givenIlyaHasFutureEvent(given);

    const bookingResponse = initTestResponseObject();

    whenIlyaRequestsHisBookings(when, bookingResponse);

    thenIlyaGetsFutureEvent1(then, bookingResponse);
  });
});
