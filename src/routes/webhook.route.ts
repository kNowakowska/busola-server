import type { FastifyInstance } from "fastify";

import { handlerWrapper } from "../utils/handlerWrapper";

import { handleCMSWebhook } from "../controllers/webhook/cms.controller";
import { handleShopWebhook } from "../controllers/webhook/shop.controller";
import { handleChatWebhook } from "../controllers/webhook/chat.controller";

export async function webhookRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/webhook/cms",
    {
      schema: {
        tags: ["Webhook"],
        summary: "Contentful webhook endpoint",
        body: { $ref: "ContentfulEntryEvent#" },
        response: {
          200: { type: "boolean" },
          400: { $ref: "ErrorResponse#" },
        },
      },
    },
    handlerWrapper(handleCMSWebhook),
  );

  fastify.post(
    "/webhook/shop",
    {
      schema: {
        tags: ["Webhook"],
        summary: "Online shop webhook endpoint",
        response: {
          200: { type: "boolean" },
          400: { $ref: "ErrorResponse#" },
        },
      },
    },
    handlerWrapper(handleShopWebhook),
  );

  fastify.post("/webhook/chat", handlerWrapper(handleChatWebhook));
}
