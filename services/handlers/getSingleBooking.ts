import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { authService } from 'services/core/auth/auth.service';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import {
  errorGettingSingleBooking,
  bookingNotFoundError,
} from 'services/core/booking/booking.errors';
import { bookingService } from 'services/core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { RequestContext } from 'services/handlers/handlers.types';
import { responderService } from 'services/responder.service';

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
) => {
  const authenticatedUser = await authService.authenticate(event);

  const query = event.queryStringParameters;

  if (!query?.carId || !query.startTime) {
    return responderService.toErrorResponse(
      bookingNotFoundError,
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
