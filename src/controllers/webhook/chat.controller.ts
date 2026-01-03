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
    req.log.error({ msg: "Invalid Slack webhook token", token });
    return res.status(401).send({ error: "Invalid Slack webhook token" });
  }

  req.log.info({ msg: "New Slack event received", event: req.body });

  const { text: message, user: author, channel: slackChannelId, subtype } = event;

  if (author !== process.env.SLACK_TEACHER_USER_ID) {
    req.log.info({ msg: "Message not from teacher, skipping", author });
    return res.status(200).send({ challenge });
  }

  if (!!subtype) {
    req.log.info({ msg: "Message has a subtype, skipping", subtype });
    return res.status(200).send({ challenge });
  }

  const user = await getUserBySlackChannelId(slackChannelId, req.log);

  if (!user) {
    req.log.error({ msg: "User not found for slack channel id", slackChannelId });
    return res.status(404).send({ error: "User not found" });
  }

  const createdMessage = await createMessage(user.uuid, message, true, req.log);

  const success = broadcastToUser(
    user.uuid,
    { type: "message.created", message: createdMessage },
    req.log,
  );
  if (!success) {
    req.log.warn({
      msg: "No websocket clients found for user, sending email notification instead",
      userId: user.uuid,
      userEmail: user.email,
      slackChannelId,
    });
    await sendMessageNotificationEmail(user.email, req.log);
  }

  return res.status(200).send({ challenge });
}
