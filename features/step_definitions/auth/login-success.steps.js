const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');
const { correctCreds } = require('../test-data');
const { makeRequest } = require('./login.utils');

When('the user logs in with correct credentials', async function () {
  const { cookie, status } = await makeRequest(correctCreds, 'POST', {
    Cookie: this.sessionCookie || '',
  });

  this.cookie = cookie;
  this.status = status;
});

Then('they get a generated session cookie', function () {
  const [key, value] = this.cookie.split('=');
  assert.strictEqual(key, 'sessionId');
  // the cookie is a uuidv4
  assert.strictEqual(value.split('-').length - 1, 4);
});

Then('they get their session cookie back', function () {
  const [key, value] = this.cookie.split('=');
  assert.strictEqual(key, 'sessionId');
  assert.strictEqual(value, correctCreds.sessionId);
});

Then('login is successful', function () {
  assert.strictEqual(this.status, 200);
});
