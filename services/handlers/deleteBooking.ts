import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { authService } from 'services/core/auth/auth.service';
import { bookingNotFoundError } from 'services/core/booking/booking.errors';
import { bookingService } from 'services/core/booking/booking.service';
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

  const deleteBookingResult = await bookingService.deleteBooking(
    authenticatedUser,
    whoseBooking,
    carId,
    startTime,
  );

  if (deleteBookingResult instanceof Error) {
    return responderService.toErrorResponse(
      deleteBookingResult,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return responderService.toSuccessResponse(
    { status: 'Deleted successfully' },
    undefined,
  );
};
