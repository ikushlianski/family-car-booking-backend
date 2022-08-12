export const badRequestBooking = new Error('Bad request');

export const errorGettingSingleBooking = new Error(
  'Error getting booking details',
);
export const errorEditingBooking = new Error(
  'Error editing booking details',
);
export const forbiddenFieldsForEditError = new Error(
  'Invalid fields supplied for editing',
);
export const errorGettingBookingList = new Error(
  'Error getting booking list',
);
export const errorSavingBooking = new Error('Error saving your booking');
export const incorrectDataInBooking = new Error(
  'Incorrect data when transforming from domain to DTO',
);
export const noBookingId = new Error('Could not find booking by ID');
export const permissionDenied = new Error('You do not have permissions');
