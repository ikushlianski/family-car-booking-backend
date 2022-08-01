const assert = require('node:assert');
const { When, Then } = require('@cucumber/cucumber');
const { wrongUsernameCreds, wrongPasswordCreds } = require('../test-data');
const { makeRequest } = require('./login.utils');

When('the user logs in with wrong username', async function () {
  const { responseBody, status } = await makeRequest(
    wrongUsernameCreds,
    'POST',
  );

  this.loginStatus = responseBody.status;
  this.status = status;
});

When('the user logs in with wrong password', async function () {
  const { responseBody, status } = await makeRequest(
    wrongPasswordCreds,
    'POST',
  );

  this.loginStatus = responseBody.status;
  this.status = status;
});

Then('login error is returned', async function () {
  assert.strictEqual(this.status, 401);
  assert.strictEqual(this.loginStatus, 'Wrong user or password');
});
