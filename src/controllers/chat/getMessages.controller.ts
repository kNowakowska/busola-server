import type { FastifyRequest, FastifyReply } from "fastify";
import { getMessages as getMessagesService } from "../../services/database/message.service";

export async function getMessages(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;

  const { pageSize = 20, page = 0 } = req.query as { pageSize: number; page: number };

  const messages = await getMessagesService(userId, pageSize, page);

  return res
    .status(200)
    .send(
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    );
}
