export const makeRequest = async (
  url: string,
  body: any,
  method = 'GET',
  headers = { Cookie: '' },
) => {
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      Cookie: headers['Cookie'],
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json();

  const cookie = response.headers.get('Set-Cookie');
  const status = response.status;

  return {
    cookie,
    status,
    responseBody,
    responseHeaders: response.headers,
  };
};
