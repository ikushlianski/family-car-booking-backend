import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { unauthorizedError } from 'core/auth/auth.errors';
import { CookieKeys, cookieService } from 'core/auth/cookie.service';
import {
  errorGettingBookingList,
  errorGettingSingleBooking,
  noBookingId,
} from 'core/booking/booking.errors';
import { bookingService } from 'core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { responderService } from 'responder.service';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const sessionIdFromDb = await cookieService.checkAuthenticated(
    event.cookies,
  );

  console.log('sessionIdFromDb', sessionIdFromDb);

  if (!sessionIdFromDb) {
    return responderService.toErrorResponse(
      unauthorizedError,
      StatusCodes.UNAUTHORIZED,
    );
  }

  const query = event.queryStringParameters;

  if (!query?.username || !query?.carId) {
    return responderService.toErrorResponse(
      noBookingId,
      StatusCodes.BAD_REQUEST,
    );
  }

  // this means we would like to get a list of bookings
  if (!query.startTime) {
    const { carId, username } = query;

    const [bookingListError, bookings] =
      await bookingService.getNextWeeksBookings({
        username,
        carId,
      });

    if (bookingListError) {
      return responderService.toErrorResponse(
        errorGettingBookingList,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    if (!bookings) {
      return responderService.toErrorResponse(
        errorGettingBookingList,
        StatusCodes.NOT_FOUND,
      );
    }

    return responderService.toSuccessResponse(bookings, undefined, [
      cookieService.makeCookie(CookieKeys.SESSION_ID, sessionIdFromDb),
    ]);
  }

  const { carId, username, startTime } = query;

  const [bookingDetailsError, booking] =
    await bookingService.getBookingDetails({
      carId,
      username,
      // todo would be nice to use a mapper for such cases
      startTime: +startTime,
    });

  if (bookingDetailsError) {
    return responderService.toErrorResponse(
      errorGettingSingleBooking,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (!booking) {
    console.error('No booking with this ID found');

    return responderService.toErrorResponse(
      errorGettingSingleBooking,
      StatusCodes.NOT_FOUND,
    );
  }

  return responderService.toSuccessResponse(booking, undefined, [
    cookieService.makeCookie(CookieKeys.SESSION_ID, sessionIdFromDb),
  ]);
};
