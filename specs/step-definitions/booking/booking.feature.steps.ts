import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  givenIlyaHasFutureEvent,
  givenIlyaIsRegistered,
  givenPapaIsRegistered,
  givenStrangerIsRegistered,
} from 'specs/step-definitions/booking/booking.given';
import {
  thenItemXNameIsY,
  thenIlyaGetsEventsUpTo2WeeksAhead,
  thenIlyaGetsFutureEvent1,
} from 'specs/step-definitions/booking/booking.then';
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

  test('Booking list includes events only 2 weeks ahead', async ({
    given,
    when,
    then,
  }) => {
    setupBackground(given);

    givenIlyaHasFutureEvent(given); // in 2 days
    givenIlyaHasFutureEvent(given); // in 13 days
    givenIlyaHasFutureEvent(given); // in 22 days

    const bookingResponse = initTestResponseObject();

    whenIlyaRequestsHisBookings(when, bookingResponse);

    thenIlyaGetsEventsUpTo2WeeksAhead(then, bookingResponse);

    thenItemXNameIsY(then, bookingResponse);
    thenItemXNameIsY(then, bookingResponse);
  });
});
