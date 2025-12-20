import type { FastifyReply, FastifyRequest } from "fastify";

import { createMessage } from "../../services/database/message.service";
import { postMessageToSlack } from "../../services/slackService/postMessageToSlack.service";
import { getUserById } from "../../services/database/user.service";

export async function publishMessage(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { message } = req.body as { message: string };

  if (!message.trim()) {
    console.error("Invalid message");
    return res.status(400).send({ error: "Nieprawidłowa wiadomość" });
  }

  const user = await getUserById(userId);

  if (!user?.slackChannel) {
    console.error("User doesn't have a Slack channel");
    return res.status(400).send({ error: "Nie możesz wysyłać wiadomości" });
  }

  const createdMessage = await createMessage(userId, message);

  try {
    console.log("Posting message to Slack");
    await postMessageToSlack(user.slackChannel, message);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: "Nie udało się wysłać wiadomości" });
  }

  return res.status(200).send(createdMessage);
}
