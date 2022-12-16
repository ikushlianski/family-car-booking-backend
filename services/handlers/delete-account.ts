import {
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { authService } from 'services/core/auth/auth.service';
import { bookingRepository } from 'services/core/booking/booking.repository';
import { userRepository } from 'services/core/user/user.repository';
import { RequestContext } from 'services/handlers/handlers.types';
import { responderService } from 'services/responder.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<RequestContext>,
) {
  const authenticatedUser = await authService.authenticate(event);

  if (!authenticatedUser) {
    return responderService.toErrorResponse(
      new Error('No access token provided in request'),
      StatusCodes.BAD_REQUEST,
    );
  }

  await bookingRepository.removeBookingsByUser(authenticatedUser.username);

  await userRepository.removeUser(authenticatedUser.username);

  const client = new CognitoIdentityProviderClient({});

  const deactivateCommand = new AdminDisableUserCommand({
    Username: authenticatedUser.username,
    UserPoolId: process.env.USER_POOL_ID,
  });

  try {
    console.log(`Deactivating ${authenticatedUser.username}`);
    await client.send(deactivateCommand);
  } catch (e) {
    console.error(e.message);

    return responderService.toErrorResponse(
      e,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const deleteUserCommand = new AdminDeleteUserCommand({
    Username: authenticatedUser.username,
    UserPoolId: process.env.USER_POOL_ID,
  });

  try {
    console.log(`Deleting ${authenticatedUser.username}`);
    await client.send(deleteUserCommand);

    return responderService.toSuccessResponse({ status: 'User removed' });
  } catch (e) {
    console.error(e.message);

    return responderService.toErrorResponse(
      e,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
