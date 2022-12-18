export interface RequestContext {
  authorizer: {
    jwt: {
      claims: Claims;
      scopes: any;
    };
  };
}

export interface Claims {
  aud: string;
  auth_time: string;
  'cognito:username': string;
  email: string;
  email_verified: string;
  event_id: string;
  exp: string;
  iat: string;
  iss: string;
  sub: string;
  token_use: string;
}
