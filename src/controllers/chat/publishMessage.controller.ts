import type { FastifyReply, FastifyRequest } from "fastify";
import { createMessage } from "../../services/database/message.service";

export async function publishMessage(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { message } = req.body as { message: string };

  if (!message.trim()) {
    console.error("Invalid message");
    return res.status(400).send({ error: "Nieprawidłowa wiadomość" });
  }

  const createdMessage = await createMessage(userId, message);

  return res.status(200).send(createdMessage);
}
