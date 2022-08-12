import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { bookingMapper } from 'core/booking/booking.mapper';
import { bookingService } from 'core/booking/booking.service';
import { StatusCodes } from 'http-status-codes';
import { unauthorizedError } from 'core/auth/auth.errors';
import { CookieKeys, cookieService } from 'core/auth/cookie.service';
import {
  badRequestBooking,
  noBookingId,
} from 'core/booking/booking.errors';
import { IEditBookingDto } from 'core/booking/booking.types';
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

  let body: IEditBookingDto;

  try {
    body = JSON.parse(event.body);

    // todo validation
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

  if (editBookingError || !editBookingSuccess) {
    return responderService.toErrorResponse(
      editBookingError,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (editBookingSuccess === true) {
    return responderService.toSuccessResponse(
      { status: 'Success' },
      undefined,
      [
        cookieService.makeCookie(
          CookieKeys.SESSION_ID,
          authenticatedUser.sessionId,
        ),
      ],
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
