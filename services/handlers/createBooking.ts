import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { authService } from 'services/core/auth/auth.service';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import { bookingService } from 'services/core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { badRequestBooking } from 'services/core/booking/booking.errors';
import { ICreateBookingDto } from 'services/core/booking/booking.types';
import { RequestContext } from 'services/handlers/handlers.types';
import { responderService } from 'services/responder.service';

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
) => {
  const authenticatedUser = await authService.authenticate(event);
  let body: ICreateBookingDto;

  try {
    body = JSON.parse(event.body);

    // todo validation
  } catch (e) {
    return responderService.toErrorResponse(
      badRequestBooking,
      StatusCodes.BAD_REQUEST,
    );
  }

  const [createBookingError, booking] = await bookingService.createBooking(
    body,
  );

  if (createBookingError) {
    return responderService.toErrorResponse(
      createBookingError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const [bookingMappingError, bookingResponse] =
    bookingMapper.domainToDto(booking);

  if (bookingMappingError) {
    console.error('Could not map booking from domain to DTO');

    return responderService.toErrorResponse(
      bookingMappingError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return responderService.toSuccessResponse(
    { booking: bookingResponse },
    undefined,
  );
};
