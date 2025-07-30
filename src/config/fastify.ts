import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCookie, {
  secret: process.env.JWT_SECRET!,
  parseOptions: {
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

fastify.register(fastifyJWT, {
  secret: process.env.JWT_SECRET_KEY!,
});

export { fastify };
