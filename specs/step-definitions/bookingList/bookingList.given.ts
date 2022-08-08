import { addDays } from 'date-fns';
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

export const givenIlyaHasFutureEvent = (given) => {
  given(
    /^there is a booking for user "(.*)" on carId "(.*)" due in (\d+) days called "(.*)"$/,
    async function (
      username: string,
      carId: string,
      daysIntoTheFuture: number,
      bookingDescr: string,
    ) {
      try {
        await FamilyCarBookingApp.entities.booking
          .create({
            username,
            carId,
            startTime: +addDays(new Date(), daysIntoTheFuture) / 1000,
            description: bookingDescr,
          })
          .go();
      } catch (e) {
        console.error(e);
      }
    },
  );
};
