import { UserRoles } from 'services/core/user/user.constants';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { testData } from 'specs/step-definitions/test-data';

const userSettings = {
  rideCompletionText: 'Машина в гараже',
  notifications: {
    getNotifiedWhenBookingChanged: true,
    getNotifiedWhenBookingCreated: true,
  },
};

export const givenPapaIsRegistered = (given) => {
  given(
    'Papa is registered, provides a family honda car and can drive it',
    async () => {
      await FamilyCarBookingApp.entities.user
        .create({
          username: 'papa',
          password: process.env.PAPA_PASSWORD as string,
          sessionId: 'test-session-id-papa',
          roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
          availableCarIds: [testData.familyCarId],
          providedCarIds: [testData.familyCarId],
          ...userSettings,
        })
        .go();
    },
  );
};

export const givenIlyaIsRegistered = (given) => {
  given(
    'Ilya is registered, can drive family honda but does not provide any cars',
    async () => {
      await FamilyCarBookingApp.entities.user
        .create({
          username: 'ilya',
          password: process.env.ILYA_PASSWORD as string,
          sessionId: 'test-session-id-ilya',
          roles: [UserRoles.DRIVER],
          availableCarIds: [testData.familyCarId],
          providedCarIds: [],
          ...userSettings,
        })
        .go();
    },
  );
};

export const givenStrangerIsRegistered = (given) => {
  given(
    'Stranger is registered, provides a BMW and can drive it',
    async () => {
      await FamilyCarBookingApp.entities.user
        .create({
          username: 'stranger',
          password: process.env.STRANGER_PASSWORD as string,
          sessionId: 'test-session-id-stranger',
          roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
          availableCarIds: [testData.familyCarId],
          providedCarIds: [testData.familyCarId],
          ...userSettings,
        })
        .go();
    },
  );
};

export const givenTodayIs01Aug2022 = (given) => {
  given('today is Aug 1, 2022', () => {
    jest.useFakeTimers('modern');

    jest.setSystemTime(new Date('Aug 1, 2022 09:00'));
  });
};

export const givenIlyaHasFutureEvent = (given) => {
  given(
    'there is a booking for user Ilya for Aug 3 2022, 11:00 called Future Event 1',
    async () => {
      await FamilyCarBookingApp.entities.booking
        .create({
          username: 'ilya',
          carId: testData.familyCarId,
          startTime: 1659513600,
          description: 'Ilya - future event 1',
        })
        .go();
    },
  );
};
