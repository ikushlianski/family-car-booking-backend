const { Before, AfterAll } = require('@cucumber/cucumber');
const {
  correctCreds,
  wrongUsernameCreds,
  wrongPasswordCreds,
} = require('./test-data');
const { FamilyCarBookingApp } = require('../../services/db/db.service');

Before(async () => {
  console.log('I am the BEFORE hook');

  await removeAllTestUsers();

  console.log('BEFORE hook: all users successfully removed from DB');
});

AfterAll(async () => {
  console.log('I am the AFTER ALL hook');

  await removeAllTestUsers();

  console.log('AFTER ALL hook: all users successfully removed from DB');
});

async function removeAllTestUsers() {
  const removeCorrectUser = FamilyCarBookingApp.entities.user
    .delete({ username: correctCreds.username })
    .go();

  const removeUserWithIncorrectUsername = FamilyCarBookingApp.entities.user
    .delete({ username: wrongUsernameCreds.username })
    .go();

  const removeUserWithIncorrectPassword = FamilyCarBookingApp.entities.user
    .delete({ username: wrongPasswordCreds.username })
    .go();

  await Promise.all([
    removeCorrectUser,
    removeUserWithIncorrectPassword,
    removeUserWithIncorrectUsername,
  ]);
}
