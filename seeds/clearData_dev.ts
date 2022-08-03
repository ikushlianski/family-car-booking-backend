// noinspection ES6PreferShortImport

import { FAMILY_HONDA_CAR_NUMBER } from '../services/core/car/car.constants';
import { FamilyCarBookingApp } from '../services/db/db.service';

(async () => {
  await Promise.all([
    // remove users
    FamilyCarBookingApp.entities.user.delete({ username: 'papa' }).go(),
    FamilyCarBookingApp.entities.user.delete({ username: 'ilya' }).go(),

    // remove cars
    FamilyCarBookingApp.entities.car
      .delete({ carId: FAMILY_HONDA_CAR_NUMBER })
      .go(),

    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'ilya',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: 1654611000,
      })
      .go(),

    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'ilya',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: 1659711000,
      })
      .go(),

    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'papa',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: 1659780000, // future event, relative to Aug 2 2022 09:00 (mock test time)
      })
      .go(),
  ]);
})();
