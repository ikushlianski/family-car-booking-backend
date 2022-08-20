import { FamilyCarBookingApp } from 'services/db/db.service';

interface TelegramMessageObject {
  from: {
    username: string;
  };
  text: string;
}

export class WebhookService {
  verifySecretWebhookToken = (token: string): boolean => {
    return token === process.env.TG_SECRET_WEBHOOK_TOKEN;
  };

  enableTelegramNotifications = async ({
    from,
  }: TelegramMessageObject): Promise<boolean> => {
    try {
      const user = await FamilyCarBookingApp.entities.user
        .get({ username: from.username })
        .go();

      console.log('user based on TG message content', user);

      if (user) {
        await FamilyCarBookingApp.entities.user
          .update({ username: user.username })
          .set({
            tgEnabled: true,
            notifications: {
              getNotifiedWhenBookingCreated: true,
              getNotifiedWhenBookingChanged: true,
            },
          })
          .go();

        return true;
      }
    } catch (e) {
      console.error(e);

      return false;
    }

    return false;
  };

  sendGenericMessage = async () => {
    const messages = [
      `Вы уже активировали уведомления. Я сообщу здесь, как только Ваш автомобиль забронируют`,
    ];

    // for now always pick first option from the array
    await this.sendMessage(messages[0]);
  };

  sendErrorMessage = async () => {
    const message = `Что-то пошло не так. Разработчики уже в курсе и обязательно разберутся в проблеме. Пожалуйста, попробуйте снова через некоторое время`;

    await this.sendMessage(message);
  };

  sendNotificationsEnabledMessage = async ({}: TelegramMessageObject) => {
    // todo provide a link based on env variables
    const text = `Спасибо, уведомления активированы. Вы можете возвращаться обратно в приложение`;

    await this.sendMessage(text);
  };

  private sendMessage = async (text: string) => {
    const tgApiBaseUrl = process.env.TG_API_BASE_URL;
    const chatId = process.env.TG_BOT_CHAT_ID;

    console.log('tgApiBaseUrl', tgApiBaseUrl);
    console.log('chatId', chatId);

    if (tgApiBaseUrl && chatId) {
      const tgApiSendMsgUrl = `${tgApiBaseUrl}/sendMessage`;

      console.log('tgApiSendMsgUrl', tgApiSendMsgUrl);

      try {
        const body = JSON.stringify({ chat_id: chatId, text });

        const response = await fetch(tgApiSendMsgUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });

        return await response.json();
      } catch (e) {
        console.error(e);

        throw e;
      }
    }
  };
}

export const webhookService = new WebhookService();
