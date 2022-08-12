import { forbiddenFieldsForEditError } from 'services/core/booking/booking.errors';

export class BookingValidator {
  checkFieldsToBeEdited = (body: any): Error | void => {
    if (body.username || body.carId) {
      return forbiddenFieldsForEditError;
    }
  };
}

export const bookingValidationService = new BookingValidator();
