// noinspection ES6PreferShortImport

import {
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  FAMILY_HONDA_CAR_NUMBER,
  STRANGERS_BMW,
} from 'services/core/car/car.constants';
import { FamilyCarBookingApp } from 'services/db/db.service';

console.log('process.env.USER_POOL_ID', process.env.USER_POOL_ID);

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
      .delete({ username: 'kushliansky@gmail.com' })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: 'mariya_kalib' })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: 'mariakazakova92@gmail.com' })
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
        username: 'kushliansky@gmail.com',
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
        username: 'mariakazakova92@gmail.com',
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

async function removeUser(username) {
  const client = new CognitoIdentityProviderClient({});

  const deactivateCommand = new AdminDisableUserCommand({
    Username: username,
    UserPoolId: process.env.USER_POOL_ID,
  });

  try {
    console.log(`Deactivating ${username}`);
    await client.send(deactivateCommand);
  } catch (e) {
    console.error(e.message);

    return;
  }

  const deleteUserCommand = new AdminDeleteUserCommand({
    Username: username,
    UserPoolId: process.env.USER_POOL_ID,
  });

  try {
    console.log(`Deleting ${username}`);
    await client.send(deleteUserCommand);
  } catch (e) {
    console.error(e.message);

    return;
  }
}

(async () => {
  await removeUser('kushliansky@gmail.com');
})();
(async () => {
  await removeUser('mariakazakova92@gmail.com');
})();
