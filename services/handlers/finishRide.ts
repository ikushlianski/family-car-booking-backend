import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { bookingService } from 'services/core/booking/booking.service';
import { unauthorizedError } from 'services/core/auth/auth.errors';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import {
  bookingNotFoundError,
  finishRideError,
} from 'services/core/booking/booking.errors';
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

  if (!query?.carId || !query.startTime) {
    return responderService.toErrorResponse(
      bookingNotFoundError,
      StatusCodes.BAD_REQUEST,
    );
  }

  const { username: whoseBooking, carId, startTime } = query;

  const finishRideResult = await bookingService.finishRide({
    username: whoseBooking || authenticatedUser.username,
    carId,
    startTime: +startTime,
  });

  if (finishRideResult === false) {
    return responderService.toErrorResponse(
      finishRideError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  // would be nice to have a function for this error inferring process
  if (
    finishRideResult instanceof Error &&
    finishRideResult.message === bookingNotFoundError.message
  ) {
    return responderService.toErrorResponse(
      bookingNotFoundError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return responderService.toSuccessResponse(
    { status: 'Finished ride successfully' },
    undefined,
    [
      cookieService.makeCookie(
        CookieKeys.SESSION_ID,
        authenticatedUser.sessionId,
      ),
    ],
  );
};
