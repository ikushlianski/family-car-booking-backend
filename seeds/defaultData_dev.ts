// noinspection ES6PreferShortImport

import { FAMILY_HONDA_CAR_NUMBER } from '../services/core/car/car.constants';
import { UserRoles } from '../services/core/user/user.constants';
import { FamilyCarBookingApp } from '../services/db/db.service';

(async () => {
  // cars
  const insertCarHonda = FamilyCarBookingApp.entities.car
    .create({
      carId: FAMILY_HONDA_CAR_NUMBER,
      username: 'owner#papa',
    })
    .go();

  // users
  const insertUserIlya = FamilyCarBookingApp.entities.user
    .create({
      username: 'ilya',
      password: process.env.ILYA_PASSWORD as string,
      sessionId: 'test-session-id',
      roles: [UserRoles.DRIVER],
      availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
      rideCompletionText: 'Машина в гараже',
      notifications: {
        getNotifiedWhenBookingChanged: true,
        getNotifiedWhenBookingCreated: true,
      },
    })
    .go();

  const insertUserPapa = FamilyCarBookingApp.entities.user
    .create({
      username: 'papa',
      password: process.env.PAPA_PASSWORD as string,
      roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
      availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
      rideCompletionText: 'Машина в гараже',
      notifications: {
        getNotifiedWhenBookingChanged: true,
        getNotifiedWhenBookingCreated: true,
      },
    })
    .go();

  const insertIlyaBooking = FamilyCarBookingApp.entities.booking
    .create({
      username: 'ilya',
      carId: FAMILY_HONDA_CAR_NUMBER,
      startTime: 1659420000,
      description: 'Going to the country!',
    })
    .go();

  await Promise.all([
    insertCarHonda,
    insertUserPapa,
    insertUserIlya,
    insertIlyaBooking,
  ]);

  console.log('Seeding done');
})();
