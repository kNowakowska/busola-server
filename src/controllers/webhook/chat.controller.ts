import type { FastifyReply, FastifyRequest } from "fastify";

import { createMessage } from "../../services/database/message.service";
import { getUserBySlackChannelId } from "../../services/database/user.service";
import { broadcastToUser } from "../../config/websocket";
import { sendEmail } from "../../services/emailNotifications/sendEmail";

export async function handleChatWebhook(req: FastifyRequest, res: FastifyReply) {
  const { token, event, challenge } = req.body as {
    token: string;
    event: { text: string; user: string; channel: string };
    challenge: string;
  };

  if (token !== process.env.SLACK_WEBHOOK_TOKEN) {
    console.error("Invalid Slack webhook token");
    return res.status(401).send({ error: "Invalid Slack webhook token" });
  }

  console.log("New Slack event received", event);

  const { text: message, user: author, channel: slackChannelId } = event;

  if (author !== process.env.SLACK_TEACHER_USER_ID) {
    console.log("Message not from teacher, skipping");
    return res.status(200).send({ challenge });
  }

  const user = await getUserBySlackChannelId(slackChannelId);

  if (!user) {
    console.error("User not found for slack channel id: ", slackChannelId);
    return res.status(404).send({ error: "User not found" });
  }

  const createdMessage = await createMessage(user.uuid, message, true);

  broadcastToUser(user.uuid, { type: "message.created", message: createdMessage });

  await sendEmail(
    user.email,
    "BUSOLA: Nowa wiadomość od Grzegorza Natanka",
    "Grzegorz Natanek odpowiedział na Twoją wiadomość. Zaloguj się do aplikacji Busola zeby ją zobaczyć.",
  );

  return res.status(200).send({ challenge });
}
