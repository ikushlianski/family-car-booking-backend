import { FamilyCarBookingApp } from 'services/db/db.service';
import { testData } from './test-data';

export async function removeAllData() {
  await removeAllTestUsers();
  await removeAllTestCars();
  await removeAllTestBookings();
}

async function removeAllTestUsers() {
  await Promise.all([
    FamilyCarBookingApp.entities.user
      .delete({ username: testData.correctCreds.username })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: testData.wrongUsernameCreds.username })
      .go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: testData.wrongPasswordCreds.username })
      .go(),
    FamilyCarBookingApp.entities.user.delete({ username: 'ilya' }).go(),
    FamilyCarBookingApp.entities.user.delete({ username: 'papa' }).go(),
    FamilyCarBookingApp.entities.user
      .delete({ username: 'stranger' })
      .go(),
  ]);
}

async function removeAllTestCars() {
  await Promise.all([
    FamilyCarBookingApp.entities.car
      .delete({ carId: testData.familyCarId })
      .go(),
    FamilyCarBookingApp.entities.car
      .delete({ carId: testData.strangerCarId })
      .go(),
  ]);
}

async function removeAllTestBookings() {
  const allTestBookings = await Promise.all([
    FamilyCarBookingApp.entities.booking.query
      .bookings({
        username: 'ilya',
        carId: testData.familyCarId,
      })
      .go(),
    FamilyCarBookingApp.entities.booking.query
      .bookings({
        username: 'papa',
        carId: testData.familyCarId,
      })
      .go(),
    FamilyCarBookingApp.entities.booking.query
      .bookings({
        username: 'stranger',
        carId: testData.strangerCarId,
      })
      .go(),
  ]);

  const testBookingsToRemove = allTestBookings.flat(1).map((booking) => {
    return FamilyCarBookingApp.entities.booking
      .delete({
        username: booking.username,
        carId: booking.carId,
        startTime: booking.startTime,
      })
      .go();
  });

  await Promise.all(testBookingsToRemove);
}
