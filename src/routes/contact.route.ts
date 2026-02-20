import type { FastifyInstance } from "fastify";
import { handlerWrapper } from "../utils/handlerWrapper";
import { sendMessage } from "../controllers/contact/sendMessage.controller";

export async function contactRoutes(fastify: FastifyInstance) {
  fastify.post("/contact/message", handlerWrapper(sendMessage));
}
