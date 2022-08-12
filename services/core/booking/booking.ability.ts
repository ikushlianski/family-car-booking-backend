import { defineAbility } from '@casl/ability';
import { UserRoles } from 'core/user/user.constants';
import { UserEntity } from 'core/user/user.entity';

export const defineBookingEntityAbilitiesFor = (user: UserEntity) =>
  defineAbility((can) => {
    const carsProvided = user.providedCars;
    const carsAvailable = user.availableCars;

    // read
    can('read', 'BookingEntity', { carNumber: { $in: carsProvided } });
    can('read', 'BookingEntity', { carNumber: { $in: carsAvailable } });
    can('read', 'BookingEntity', { bookingOwner: user.username });

    // edit
    can('edit', 'BookingEntity', { bookingOwner: user.username });

    // delete
    can('delete', 'BookingEntity', { bookingOwner: user.username });

    if (user.roles.includes(UserRoles.ADMINISTRATOR)) {
      can('manage', 'all');
    }
  });
