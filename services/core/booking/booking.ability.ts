import { defineAbility } from '@casl/ability';
import { BookingEntity } from 'core/booking/booking.entity';
import { UserRoles } from 'core/user/user.constants';
import { UserEntity } from 'core/user/user.entity';

export const defineBookingAbilityFor = (user: UserEntity) =>
  defineAbility((can) => {
    const carsProvided = user.availableCars;

    can('read', 'BookingEntity', { carNumber: { $in: carsProvided } });
    can('read', 'BookingEntity', { bookingOwner: user.username });

    if (user.roles.includes(UserRoles.ADMINISTRATOR)) {
      can('manage', 'all');
    }
  });
