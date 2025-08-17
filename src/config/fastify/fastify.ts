import Fastify from "fastify";

import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import cors from "@fastify/cors";

import { swaggerConfig } from "./swagger";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCookie, {
  secret: process.env.JWT_SECRET!,
  parseOptions: {
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

fastify.register(fastifyJWT, {
  secret: process.env.JWT_SECRET_KEY!,
});

fastify.register(cors, {
  origin: [process.env.FRONTEND_URL!],
  credentials: true,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

swaggerConfig(fastify);

export { fastify };
