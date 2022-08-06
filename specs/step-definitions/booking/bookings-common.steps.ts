import { UserRoles } from 'services/core/user/user.constants';
import { testData } from '../test-data';
import {
  loadFeature,
  defineFeature,
  StepDefinitions,
} from 'jest-cucumber';
import { FamilyCarBookingApp } from 'services/db/db.service';

export const bookingSteps: StepDefinitions = ({
  given,
  and,
  when,
  then,
}) => {
  given(/Papa is registered/, async () => {
    await FamilyCarBookingApp.entities.user
      .create({
        username: 'papa',
        password: process.env.PAPA_PASSWORD as string,
        sessionId: 'test-session-id-papa',
        roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
        availableCarIds: [testData.familyCarId],
        providedCarIds: [testData.familyCarId],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: true,
          getNotifiedWhenBookingCreated: true,
        },
      })
      .go();
  });
};
