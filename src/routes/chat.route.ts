import type { FastifyInstance } from "fastify";

import { handlerWrapper } from "../utils/handlerWrapper";

import { handleChatWebsocket } from "../controllers/chat/chat.controller";
import { getMessages } from "../controllers/chat/getMessages.controller";
import { publishMessage } from "../controllers/chat/publishMessage.controller";

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.get("/chat/wss", { websocket: true }, handleChatWebsocket);

  fastify.get("/chat/message", handlerWrapper(getMessages));
  fastify.post("/chat/message", handlerWrapper(publishMessage));
}
