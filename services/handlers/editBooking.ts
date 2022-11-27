import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { authService } from 'services/core/auth/authService';
import { bookingMapper } from 'services/core/booking/booking.mapper';
import { bookingService } from 'services/core/booking/booking.service';
import {
  CookieKeys,
  cookieService,
} from 'services/core/auth/cookie.service';
import {
  badRequestBooking,
  bookingNotFoundError,
} from 'services/core/booking/booking.errors';
import { IEditBookingDto } from 'services/core/booking/booking.types';
import { RequestContext } from 'services/handlers/handlers.types';
import { responderService } from 'services/responder.service';

export const handler = async (
  event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
) => {
  const authenticatedUser = await authService.getUserByJwtClaims(
    event.requestContext.authorizer.jwt.claims,
  );

  const query = event.queryStringParameters;

  if (!query?.carId || !query.startTime) {
    return responderService.toErrorResponse(
      bookingNotFoundError,
      StatusCodes.BAD_REQUEST,
    );
  }

  let body: IEditBookingDto;

  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return responderService.toErrorResponse(
      badRequestBooking,
      StatusCodes.BAD_REQUEST,
    );
  }

  const { username: whoseBooking, carId, startTime } = query;

  const [editBookingError, editBookingSuccess] =
    await bookingService.editBooking(
      authenticatedUser,
      whoseBooking,
      carId,
      startTime,
      body,
    );

  if (editBookingError) {
    return responderService.toErrorResponse(
      editBookingError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const [bookingMappingError, bookingResponse] =
    bookingMapper.domainToDto(editBookingSuccess);

  if (bookingMappingError) {
    console.error('Could not map edited booking from domain to DTO');

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
