const { loginUrl } = require('../test-data');

const makeRequest = async (body, method = 'GET', headers = {}) => {
  const response = await fetch(loginUrl, {
    method,
    headers: {
      ...headers,
      Cookie: headers['Cookie'] || '',
    },
    body: JSON.stringify(body),
  });

  this.responseBody = await response.json();
  this.cookie = response.headers.get('Set-Cookie');
  this.status = response.status;

  return {
    cookie: this.cookie,
    status: this.status,
    responseBody: this.responseBody,
    responseHeaders: response.headers,
  };
};

module.exports = {
  makeRequest,
};
