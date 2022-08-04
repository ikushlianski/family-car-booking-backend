import { Maybe, MaybeArray } from 'app.types';
import { defineBookingAbilityFor } from 'core/booking/booking.ability';
import { BookingEntity } from 'core/booking/booking.entity';
import {
  bookingBadRequest,
  errorGettingBookingList,
  errorGettingSingleBooking,
} from 'core/booking/booking.errors';
import { bookingRepository } from 'core/booking/booking.repository';
import {
  GetBookingListServiceParams,
  GetSingleBookingServiceParams,
} from 'core/booking/booking.types';
import { userRepository } from 'core/user/user.repository';

export class BookingService {
  getNextWeeksBookings = async ({
    user: loggedInUser,
    carId,
    weekCount = 2,
    rolesMetadata: { requestingOwnResource, requestingForUsername },
  }: GetBookingListServiceParams): Promise<MaybeArray<BookingEntity>> => {
    const currentDateSeconds = Date.now() / 1000;
    const oneWeekAheadSeconds = 60 * 60 * 24 * 7;
    const maxDateSeconds =
      currentDateSeconds + oneWeekAheadSeconds * weekCount;

    const otherUser = await userRepository.getOneByUsername(
      requestingForUsername!,
    );

    if (!otherUser) {
      console.error(
        "User is requesting someone else's resource, but that other user was not found",
      );

      return [bookingBadRequest, undefined];
    }

    try {
      const baseBookingList = await bookingRepository.getList({
        user: requestingOwnResource ? loggedInUser : otherUser,
        carId,
        from: currentDateSeconds,
        to: maxDateSeconds,
      });

      const bookingAbility = defineBookingAbilityFor(loggedInUser);

      const allowedBookings = baseBookingList.filter((booking) => {
        return bookingAbility.can('read', booking);
      });

      return [undefined, allowedBookings];
    } catch (e) {
      console.error('Error querying booking list', e);

      return [errorGettingBookingList, undefined];
    }
  };

  getBookingDetails = async ({
    user,
    carId,
    startTime,
    rolesMetadata: { currentUserRoles, requestingOwnResource },
  }: GetSingleBookingServiceParams): Promise<Maybe<BookingEntity>> => {
    // todo use roles to see whether the user can get booking details

    try {
      const booking = await bookingRepository.getSingleBooking({
        user,
        carId,
        startTime,
      });

      return [undefined, booking];
    } catch (e) {
      console.error('Error querying single booking', e);

      return [errorGettingSingleBooking, undefined];
    }
  };
}

export const bookingService = new BookingService();
