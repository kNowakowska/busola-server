import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
  return { message: "Hello from Fastify + Bun + TypeScript!" };
});

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
