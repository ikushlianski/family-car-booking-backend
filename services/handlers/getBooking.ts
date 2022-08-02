import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { unauthorizedError } from 'core/auth/auth.errors';
import { CookieKeys, cookieService } from 'core/auth/cookie.service';
import {
  errorGettingSingleBooking,
  noBookingId,
} from 'core/booking/booking.errors';
import { bookingService } from 'core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { responderService } from 'responder.service';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const [authenticated, sessionIdFromDb] =
    cookieService.checkAuthenticated(event.cookies);

  if (!authenticated || !sessionIdFromDb) {
    return responderService.toErrorResponse(
      unauthorizedError,
      StatusCodes.UNAUTHORIZED,
    );
  }

  const query = event.queryStringParameters;

  if (!query?.username || !query?.carId || !query?.startTime) {
    return responderService.toErrorResponse(
      noBookingId,
      StatusCodes.BAD_REQUEST,
    );
  }

  const { carId, username, startTime } = query;

  const [getBookingError, booking] =
    await bookingService.getBookingDetails({
      carId,
      username,
      // todo would be nice to use a mapper for such cases
      startTime: +startTime,
    });

  if (getBookingError) {
    return responderService.toErrorResponse(
      errorGettingSingleBooking,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (!booking) {
    return responderService.toErrorResponse(
      errorGettingSingleBooking,
      StatusCodes.NOT_FOUND,
    );
  }

  return responderService.toSuccessResponse(booking, undefined, [
    cookieService.makeCookie(CookieKeys.SESSION_ID, sessionIdFromDb),
  ]);
};
