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
  const authenticatedUser = await cookieService.checkAuthenticated(
    event.cookies,
  );

  if (!authenticatedUser || !authenticatedUser.sessionId) {
    return responderService.toErrorResponse(
      unauthorizedError,
      StatusCodes.UNAUTHORIZED,
    );
  }

  const query = event.queryStringParameters;

  if (!query?.carId || !query.startTime) {
    return responderService.toErrorResponse(
      noBookingId,
      StatusCodes.BAD_REQUEST,
    );
  }

  const { carId, startTime } = query;
  const { username, roles, sessionId } = authenticatedUser;

  const [bookingDetailsError, booking] =
    await bookingService.getBookingDetails({
      user: authenticatedUser,
      carId,
      // todo would be nice to use a mapper for such cases
      startTime: +startTime,
      rolesMetadata: {
        requestingOwnResource: query?.username === username,
        currentUserRoles: roles,
      },
    });

  if (bookingDetailsError) {
    return responderService.toErrorResponse(
      errorGettingSingleBooking,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (!booking) {
    console.error('Found no bookings with given ID');

    return responderService.toErrorResponse(
      errorGettingSingleBooking,
      StatusCodes.NOT_FOUND,
    );
  }

  return responderService.toSuccessResponse({ booking }, undefined, [
    cookieService.makeCookie(CookieKeys.SESSION_ID, sessionId),
  ]);
};
