export class WebhookService {
  verifySecretWebhookToken = (token: string) => {
    return token === process.env.SECRET_WEBHOOK_TOKEN;
  };
}

export const webhookService = new WebhookService();
