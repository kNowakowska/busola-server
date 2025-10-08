import type { FastifyReply, FastifyRequest } from "fastify";

export async function handleShopWebhook(req: FastifyRequest, res: FastifyReply) {
  return res.send(true);
}
