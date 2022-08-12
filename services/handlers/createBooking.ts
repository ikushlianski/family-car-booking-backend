import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import { bookingService } from 'services/core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { unauthorizedError } from 'services/core/auth/auth.errors';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import { badRequestBooking } from 'services/core/booking/booking.errors';
import { ICreateBookingDto } from 'services/core/booking/booking.types';
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
    [
      cookieService.makeCookie(
        CookieKeys.SESSION_ID,
        authenticatedUser.sessionId,
      ),
    ],
  );
};
