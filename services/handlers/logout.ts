import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  let accessToken;

  try {
    ({ accessToken } = JSON.parse(event.body));
  } catch (e) {
    return responderService.toErrorResponse(
      new Error('Bad request'),
      StatusCodes.BAD_REQUEST,
    );
  }

  if (!accessToken) {
    return responderService.toErrorResponse(
      new Error('No access token provided in request'),
      StatusCodes.BAD_REQUEST,
    );
  }

  const client = new CognitoIdentityProviderClient({});

  const signOutCommand = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  try {
    await client.send(signOutCommand);

    return responderService.toSuccessResponse({ status: 'Logged out' });
  } catch (e) {
    return responderService.toErrorResponse(
      e,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
