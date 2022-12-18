import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { authService } from 'services/core/auth/auth.service';
import { bookingService } from 'services/core/booking/booking.service';
import {
  bookingNotFoundError,
  finishRideError,
  permissionDenied,
} from 'services/core/booking/booking.errors';
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

  const { username: whoseBooking, carId, startTime } = query;

  const finishRideResult = await bookingService.finishRide({
    username: whoseBooking,
    carId,
    startTime: +startTime,
    authenticatedUser,
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

  if (
    finishRideResult instanceof Error &&
    finishRideResult.message === permissionDenied.message
  ) {
    return responderService.toErrorResponse(
      permissionDenied,
      StatusCodes.FORBIDDEN,
    );
  }

  return responderService.toSuccessResponse(
    { status: 'Finished ride successfully' },
    undefined,
  );
};
