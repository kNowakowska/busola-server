import { fastify } from "./config/fastify";
import { authRoutes } from "./routes/auth.route";

fastify.register(authRoutes);

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
