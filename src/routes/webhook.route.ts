import type { FastifyInstance } from "fastify";

import { handlerWrapper } from "../utils/handlerWrapper";
import { handleWebhook } from "../controllers/webhook/webhook.controller";

export async function webhookRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/webhook",
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
    handlerWrapper(handleWebhook),
  );
}
