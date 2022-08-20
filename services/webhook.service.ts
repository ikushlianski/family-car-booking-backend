export class WebhookService {
  verifySecretWebhookToken = (token: string) => {
    return token === process.env.TG_SECRET_WEBHOOK_TOKEN;
  };
}

export const webhookService = new WebhookService();
