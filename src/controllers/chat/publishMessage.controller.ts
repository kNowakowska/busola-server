import type { FastifyReply, FastifyRequest } from "fastify";

import { createMessage } from "../../services/database/message.service";
import { postMessageToSlack } from "../../services/slackService/postMessageToSlack.service";
import { getUserById } from "../../services/database/user.service";

export async function publishMessage(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { message } = req.body as { message: string };

  if (!message.trim()) {
    req.log.error({ msg: "Invalid message", message, userId });
    return res.status(400).send({ error: "Nieprawidłowa wiadomość" });
  }

  const user = await getUserById(userId, req.log);

  if (!user?.slackChannel) {
    req.log.error({ msg: "User doesn't have a Slack channel", userId });
    return res.status(400).send({ error: "Nie możesz wysyłać wiadomości" });
  }

  const createdMessage = await createMessage(userId, message, false, req.log);

  try {
    const username = user.name && user.lastName ? `${user.name} ${user.lastName}` : user.email;
    req.log.info({ msg: "Posting message to Slack", userId, message, username });

    await postMessageToSlack(user.slackChannel, message, username);
  } catch (error) {
    req.log.error({ msg: "Error posting message to Slack", userId, message, error });
    return res.status(400).send({ error: "Nie udało się wysłać wiadomości" });
  }

  return res.status(200).send(createdMessage);
}
