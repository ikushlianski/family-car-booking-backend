// noinspection ES6PreferShortImport

import { addDays, subDays } from 'date-fns';
import {
  FAMILY_HONDA_CAR_NUMBER,
  STRANGERS_BMW,
} from '../services/core/car/car.constants';
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
        username: 'owner#akushlianski',
      })
      .go(),

    FamilyCarBookingApp.entities.car
      .create({
        carId: STRANGERS_BMW,
        username: 'owner#stranger',
      })
      .go(),

    /**
     * Users
     */
    FamilyCarBookingApp.entities.user
      .create({
        username: 'ilya_nice',
        firstName: 'Илья',
        password: process.env.ILYA_PASSWORD as string,
        sessionId: undefined,
        roles: [UserRoles.DRIVER],
        availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
        providedCarIds: [],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: false,
          getNotifiedWhenBookingCreated: false,
        },
      })
      .go(),

    FamilyCarBookingApp.entities.user
      .create({
        username: 'akushlianski',
        firstName: 'Андрей',
        password: process.env.PAPA_PASSWORD as string,
        sessionId: undefined,
        roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
        availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
        providedCarIds: [FAMILY_HONDA_CAR_NUMBER],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: false,
          getNotifiedWhenBookingCreated: false,
        },
      })
      .go(),

    FamilyCarBookingApp.entities.user
      .create({
        username: 'mariya_kalib',
        firstName: 'Мария',
        password: process.env.MASHA_PASSWORD as string,
        sessionId: undefined,
        roles: [UserRoles.DRIVER],
        availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
        providedCarIds: [],
        rideCompletionText: 'Машина в гараже',
        notifications: {
          getNotifiedWhenBookingChanged: false,
          getNotifiedWhenBookingCreated: false,
        },
      })
      .go(),

    FamilyCarBookingApp.entities.user
      .create({
        username: 'stranger',
        firstName: 'Джон',
        password: process.env.STRANGER_PASSWORD as string,
        sessionId: undefined,
        roles: [UserRoles.DRIVER, UserRoles.CAR_PROVIDER],
        availableCarIds: [STRANGERS_BMW],
        providedCarIds: [],
        rideCompletionText: 'I do not speak Belarusian :)',
        notifications: {
          getNotifiedWhenBookingChanged: false,
          getNotifiedWhenBookingCreated: false,
        },
      })
      .go(),

    /**
     * Bookings
     */

    // past booking, Ilya
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'ilya_nice',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculatePrevTimestampInSecs(new Date(), 5), // past event, five days ago
        description: 'Ilya - past event',
        isFinished: true,
      })
      .go(),

    // future booking, Ilya
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'ilya_nice',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculateFutureTimestampInSecs(new Date(), 5), // future event relative to the time of seeding, 5 days from now
        description: 'Ilya - future event',
      })
      .go(),

    // future booking, Papa
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'akushlianski',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculateFutureTimestampInSecs(new Date(), 2), // future event
        description: 'Papa - car repair',
      })
      .go(),

    // future booking, Masha
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'mariya_kalib',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculateFutureTimestampInSecs(new Date(), 3), // future event
        description: 'Masha - visit parents',
      })
      .go(),

    // future booking, Masha
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'mariya_kalib',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculateFutureTimestampInSecs(new Date(), 6), // future event
        description: 'Зоопарк!',
      })
      .go(),

    // future booking, Masha
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'mariya_kalib',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculateFutureTimestampInSecs(new Date(), 11), // future event
        description: 'За шубой',
      })
      .go(),

    // future booking, Masha
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'mariya_kalib',
        carId: FAMILY_HONDA_CAR_NUMBER,
        startTime: calculateFutureTimestampInSecs(new Date(), 13), // future event
        description: 'К психологу в ЛОДЭ',
      })
      .go(),

    // future booking, Stranger
    FamilyCarBookingApp.entities.booking
      .create({
        username: 'stranger',
        carId: STRANGERS_BMW,
        startTime: calculateFutureTimestampInSecs(new Date(), 6), // future event
        description: 'Stranger - future event',
      })
      .go(),
  ]);

  console.log('Seeding done');
})();

function calculateFutureTimestampInSecs(now: Date, daysToAdd: number) {
  return Math.round(+addDays(now, daysToAdd) / 1000);
}

function calculatePrevTimestampInSecs(now: Date, daysToRemove: number) {
  return Math.round(+subDays(now, daysToRemove) / 1000);
}
