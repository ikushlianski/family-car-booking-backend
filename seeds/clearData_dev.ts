// noinspection ES6PreferShortImport

import {
  FAMILY_HONDA_CAR_NUMBER,
  STRANGERS_BMW,
} from 'services/core/car/car.constants';
import { FamilyCarBookingApp } from 'services/db/db.service';

(async () => {
  await Promise.all([
    // remove users
    FamilyCarBookingApp.entities.user
      .delete({ username: 'akushlianski' })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: 'ilya_nice' })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: 'mariya_kalib' })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: 'stranger' })
      .go(),

    // remove cars
    FamilyCarBookingApp.entities.car
      .delete({ carId: FAMILY_HONDA_CAR_NUMBER })
      .go(),

    FamilyCarBookingApp.entities.car.delete({ carId: STRANGERS_BMW }).go(),
  ]);

  await removeAllBookingSeeds();
})();

async function removeAllBookingSeeds() {
  const allSeedBookings = await Promise.all([
    FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username: 'ilya_nice',
        carId: FAMILY_HONDA_CAR_NUMBER,
      })
      .go(),
    FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username: 'akushlianski',
        carId: FAMILY_HONDA_CAR_NUMBER,
      })
      .go(),
    FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username: 'mariya_kalib',
        carId: FAMILY_HONDA_CAR_NUMBER,
      })
      .go(),
    FamilyCarBookingApp.entities.booking.query
      .bookingsByUser({
        username: 'stranger',
        carId: 'bmw-789',
      })
      .go(),
  ]);

  const testBookingsToRemove = allSeedBookings.flat(1).map((booking) => {
    return FamilyCarBookingApp.entities.booking
      .delete({
        username: booking.username,
        carId: booking.carId,
        startTime: booking.startTime,
      })
      .go();
  });

  await Promise.all(testBookingsToRemove);
}
