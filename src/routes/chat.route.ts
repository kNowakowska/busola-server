import type { FastifyInstance } from "fastify";

import { handlerWrapper } from "../utils/handlerWrapper";
import { getMessages } from "../controllers/chat/getMessages.controller";
import { publishMessage } from "../controllers/chat/publishMessage.controller";

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/chat/message",
    handlerWrapper((req, res) => getMessages(req, res)),
  );

  fastify.post(
    "/chat/message",
    handlerWrapper((req, res) => publishMessage(req, res)),
  );
}
