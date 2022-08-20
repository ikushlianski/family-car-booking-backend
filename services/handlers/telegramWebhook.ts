import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda/trigger/api-gateway-proxy';
import { webhookService } from 'services/webhook.service';

export async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<unknown>,
) {
  let requestBody;

  try {
    requestBody = JSON.parse(event.body);

    const secretToken = event.headers['X-Telegram-Bot-Api-Secret-Token'];
    const verified = webhookService.verifySecretWebhookToken(secretToken);

    if (!verified) {
      console.error(
        'Malicious request from someone appearing to be Telegram',
      );
    }
  } catch (e) {
    console.error('Incorrect request body from Telegram');
  }

  console.log('requestBody.message.text', requestBody.message.text);

  if (requestBody.message.text === '/start') {
    try {
      const user = await webhookService.enableTelegramNotifications(
        requestBody.message,
      );

      if (!user) {
        await webhookService.sendErrorMessage();

        return;
      }

      await webhookService.sendNotificationsEnabledMessage(user.firstName);
    } catch (e) {
      console.error(e);

      await webhookService.sendErrorMessage();
    }
  } else {
    await webhookService.sendGenericMessage();
  }
}
