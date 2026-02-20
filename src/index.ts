import "dotenv/config";

import { fastify } from "./config/fastify/fastify";

import { authRoutes } from "./routes/auth.route";
import { dashboardRoutes } from "./routes/dashboard.route";
import { webhookRoutes } from "./routes/webhook.route";
import { chatRoutes } from "./routes/chat.route";
import { contactRoutes } from "./routes/contact.route";

fastify.register(authRoutes);
fastify.register(dashboardRoutes);
fastify.register(chatRoutes);
fastify.register(contactRoutes);

fastify.register(webhookRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: +process.env.PORT!, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
