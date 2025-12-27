import type { FastifyRequest, FastifyReply } from "fastify";

import { markMessageAsViewed as markMessageAsViewedService } from "../../services/database/message.service";

export async function markMessageAsViewed(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { messageId } = req.params as { messageId: string };

  const message = await markMessageAsViewedService(userId, messageId);

  return res.status(200).send(message);
}
