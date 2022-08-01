// noinspection ES6PreferShortImport

import { FAMILY_HONDA_CAR_NUMBER } from '../services/core/car/car.constants';
import { UserRoles } from '../services/core/user/user.constants';
import { HondaTrackerDynamoService } from '../services/db/db.service';

(async () => {
  // cars
  const insertCarHonda = HondaTrackerDynamoService.entities.car
    .create({
      carId: FAMILY_HONDA_CAR_NUMBER,
      username: 'owner#papa',
    })
    .go();

  // users
  const insertUserIlya = HondaTrackerDynamoService.entities.user
    .create({
      username: 'ilya',
      password: process.env.ILYA_PASSWORD as string,
      roles: [UserRoles.DRIVER],
      availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
      rideCompletionText: 'Машина в гараже',
      notifications: {
        getNotifiedWhenBookingChanged: true,
        getNotifiedWhenBookingCreated: true,
      },
    })
    .go();

  const insertUserPapa = HondaTrackerDynamoService.entities.user
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

  await Promise.all([insertCarHonda, insertUserPapa, insertUserIlya]);

  console.log('done');
})();
