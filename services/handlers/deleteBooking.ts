import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { authService } from 'services/core/auth/authService';
import { bookingNotFoundError } from 'services/core/booking/booking.errors';
import { bookingService } from 'services/core/booking/booking.service';
import { responderService } from 'services/responder.service';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const authenticatedUser = await authService.getUserFromIdToken(
    event.headers.authorization,
  );

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
