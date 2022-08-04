// noinspection ES6PreferShortImport

import { FAMILY_HONDA_CAR_NUMBER } from '../services/core/car/car.constants';
import { UserRoles } from '../services/core/user/user.constants';
import { FamilyCarBookingApp } from '../services/db/db.service';

(async () => {
  await Promise.all([
    /**
     * Cars
     */
    FamilyCarBookingApp.entities.car
      .create({
        carId: FAMILY_HONDA_CAR_NUMBER,
        username: 'owner#papa',
      })
      .go(),

    /**
     * Users
     */
    FamilyCarBookingApp.entities.user
      .create({
        username: 'ilya',
        password: process.env.ILYA_PASSWORD as string,
        sessionId: 'test-session-id-ilya',
        roles: [UserRoles.DRIVER],
        availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
        providedCarIds: [],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: true,
          getNotifiedWhenBookingCreated: true,
        },
      })
      .go(),

    FamilyCarBookingApp.entities.user
      .create({
        username: 'papa',
        password: process.env.PAPA_PASSWORD as string,
        sessionId: 'test-session-id-papa',
        roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
        availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
        providedCarIds: [FAMILY_HONDA_CAR_NUMBER],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: true,
          getNotifiedWhenBookingCreated: true,
        },
      })
      .go(),

    FamilyCarBookingApp.entities.user
      .create({
        username: 'masha',
        password: process.env.MASHA_PASSWORD as string,
        sessionId: 'test-session-id-masha',
        roles: [UserRoles.DRIVER],
        availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
        providedCarIds: [],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: true,
          getNotifiedWhenBookingCreated: true,
        },
      })
      .go(),

    /**
     * Bookings
     */

    // past booking, Ilya
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'ilya',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: 1654611000, // past event, relative to Aug 2 2022 (mock test time)
        description: 'Ilya - past event',
      })
      .go(),

    // future booking, Ilya
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'ilya',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: 1660716000, // future event relative to the time of seeding
        description: 'Ilya - future event',
      })
      .go(),

    // future booking, Papa
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'papa',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: 1660616000, // future event, relative to Aug 2 2022 (mock test time)
        description: 'Papa - car repair',
      })
      .go(),
  ]);

  console.log('Seeding done');
})();
