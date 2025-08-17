import { fastify } from "./config/fastify/fastify";

import { authRoutes } from "./routes/auth.route";
import { dashboardRoutes } from "./routes/dashboard.route";
import { webhookRoutes } from "./routes/webhook.route";

fastify.register(authRoutes);
fastify.register(dashboardRoutes);

fastify.register(webhookRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3050 });
    console.log("Server running on http://localhost:3050");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
