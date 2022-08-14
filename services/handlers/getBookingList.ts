import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { unauthorizedError } from 'services/core/auth/auth.errors';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import {
  errorGettingBookingList,
  bookingNotFoundError,
} from 'services/core/booking/booking.errors';
import { bookingService } from 'services/core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { responderService } from 'services/responder.service';

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
  const { username, roles, sessionId } = authenticatedUser;

  if (!query?.carId) {
    return responderService.toErrorResponse(
      bookingNotFoundError,
      StatusCodes.BAD_REQUEST,
    );
  }

  const carAvailableToAuthenticatedUser =
    await bookingService.isCarAvailableToUser(
      query.carId,
      authenticatedUser.username,
    );

  if (!carAvailableToAuthenticatedUser) {
    return responderService.toErrorResponse(
      unauthorizedError,
      StatusCodes.FORBIDDEN,
    );
  }

  const [bookingListError, bookings] =
    await bookingService.getNextWeeksBookings({
      user: authenticatedUser,
      carId: query.carId,
      rolesMetadata: {
        requestingForUsername: query?.username,
        requestingOwnResource: query?.username === username,
        currentUserRoles: roles,
      },
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

  return responderService.toSuccessResponse({ bookings }, undefined, [
    cookieService.makeCookie(CookieKeys.SESSION_ID, sessionId),
  ]);
};
