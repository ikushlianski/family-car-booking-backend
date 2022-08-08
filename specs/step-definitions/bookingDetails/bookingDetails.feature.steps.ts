import { defineFeature, loadFeature } from 'jest-cucumber';
import { thenUserGetsAnyEligibleFutureEvent } from 'specs/step-definitions/bookingDetails/bookingDetails.then';
import { whenUserRequestsTheirOwnBookingDetails } from 'specs/step-definitions/bookingDetails/bookingDetails.when';
import {
  givenIlyaHasFutureEvent,
  givenIlyaIsRegistered,
} from 'specs/step-definitions/bookingList/bookingList.given';
import { removeAllData } from 'specs/step-definitions/hooks';
import { initTestResponseObject } from 'specs/step-definitions/step-definition.utils';

const feature = loadFeature('./specs/features/bookingDetails.feature');

function setupFeatureBackground(given) {
  givenIlyaIsRegistered(given);
}

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await removeAllData();
  });

  afterAll(async () => {
    await removeAllData();
  });

  test('Ilya requests details for booking "Ilya - Future Event 0"', async ({
    given,
    when,
    then,
  }) => {
    setupFeatureBackground(given);

    const now = new Date();

    givenIlyaHasFutureEvent(given, now);

    const bookingResponse = initTestResponseObject();

    whenUserRequestsTheirOwnBookingDetails(when, bookingResponse, now);

    thenUserGetsAnyEligibleFutureEvent(then, bookingResponse);
  });

  test('Details for any personal booking are available regardless of due date', async ({
    given,
    when,
    then,
  }) => {
    const now = new Date();
    setupFeatureBackground(given);

    givenIlyaHasFutureEvent(given, now); // in 23 days, definitely more than 2 weeks

    const bookingResponse = initTestResponseObject();

    whenUserRequestsTheirOwnBookingDetails(when, bookingResponse, now);

    thenUserGetsAnyEligibleFutureEvent(then, bookingResponse);
  });
});
