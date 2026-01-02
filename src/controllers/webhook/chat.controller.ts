import type { FastifyReply, FastifyRequest } from "fastify";

import { createMessage } from "../../services/database/message.service";
import { getUserBySlackChannelId } from "../../services/database/user.service";
import { broadcastToUser } from "../../config/websocket";
import { sendMessageNotificationEmail } from "../../services/emailNotifications/sendMessageNotificationEmail";

export async function handleChatWebhook(req: FastifyRequest, res: FastifyReply) {
  const { token, event, challenge } = req.body as {
    token: string;
    event: { text: string; user: string; channel: string; subtype?: string };
    challenge: string;
  };

  if (token !== process.env.SLACK_WEBHOOK_TOKEN) {
    console.error("Invalid Slack webhook token");
    return res.status(401).send({ error: "Invalid Slack webhook token" });
  }

  console.log("New Slack event received", event);

  const { text: message, user: author, channel: slackChannelId, subtype } = event;

  if (author !== process.env.SLACK_TEACHER_USER_ID) {
    console.log("Message not from teacher, skipping");
    return res.status(200).send({ challenge });
  }

  if (!!subtype) {
    console.log("Message has a subtype, skipping: ", subtype);
    return res.status(200).send({ challenge });
  }

  const user = await getUserBySlackChannelId(slackChannelId);

  if (!user) {
    console.error("User not found for slack channel id: ", slackChannelId);
    return res.status(404).send({ error: "User not found" });
  }

  const createdMessage = await createMessage(user.uuid, message, true);

  const success = broadcastToUser(user.uuid, { type: "message.created", message: createdMessage });
  if (!success) {
    console.warn(
      "No websocket clients found for user, sending email notification instead:",
      user.uuid,
      user.email,
    );
    await sendMessageNotificationEmail(user.email);
  }

  return res.status(200).send({ challenge });
}
