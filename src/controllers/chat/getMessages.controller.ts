import type { FastifyRequest, FastifyReply } from "fastify";
import { getMessages as getMessagesService } from "../../services/database/message.service";

export async function getMessages(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;

  const { pageSize = 10, skip = 0 } = req.query as { pageSize: number; skip: number };

  const messages = await getMessagesService(userId, +pageSize, +skip, req.log);

  return res.status(200).send({
    data: messages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
    nextCursor: +skip + messages.length,
  });
}
