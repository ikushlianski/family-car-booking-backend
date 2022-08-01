const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(10 * 1000);

const { Given } = require('@cucumber/cucumber');
const { correctCreds } = require('../test-data');
const {
  HondaTrackerDynamoService,
} = require('../../../src/db/db.service');
const { UserRoles } = require('../../../src/user/user.constants');
const {
  FAMILY_HONDA_CAR_NUMBER,
} = require('../../../src/car/car.constants');

Given('the user is already registered', async function () {
  await HondaTrackerDynamoService.entities.user
    .create({
      username: correctCreds.username,
      password: Buffer.from(correctCreds.password).toString('base64'),
      roles: [UserRoles.DRIVER],
      availableCarIds: [FAMILY_HONDA_CAR_NUMBER],
    })
    .go();
});

Given('the user did not log in previously', async function () {
  await HondaTrackerDynamoService.entities.user
    .update({ username: correctCreds.username })
    .remove(['sessionId'])
    .where((attr, op) => op.eq(attr.username, correctCreds.username))
    .go();
});

Given('the user logged in before', async function () {
  await HondaTrackerDynamoService.entities.user
    .update({ username: correctCreds.username })
    .set({ sessionId: correctCreds.sessionId })
    .where((attr, op) => op.eq(attr.username, correctCreds.username))
    .go();

  this.sessionCookie = `sessionId=${correctCreds.sessionId}`;
});
