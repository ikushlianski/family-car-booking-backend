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
  await Promise.all([
    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'ilya',
        carId: testData.familyCarId,
        startTime: 1654611000,
      })
      .go(),

    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'ilya',
        carId: testData.familyCarId,
        startTime: 1660377600,
      })
      .go(),

    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'papa',
        carId: testData.familyCarId,
        startTime: 1660616000,
      })
      .go(),

    FamilyCarBookingApp.entities.booking
      .delete({
        username: 'stranger',
        carId: testData.strangerCarId,
        startTime: 1660716000,
      })
      .go(),
  ]);
}
