import Fastify from "fastify";

import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import cors from "@fastify/cors";

import { swaggerConfig } from "./swagger";
import { UserTokenPayload } from "../../types/UserTokenPayload";

declare module "fastify" {
  interface FastifyRequest {
    tokenPayload: UserTokenPayload;
  }
}

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

fastify.addHook("onRequest", (req, res, done) => {
  if (req.url.includes("/auth")) {
    done();
    return;
  }

  const token = req.cookies?.access_token;

  if (!token) {
    console.error("No token found");
    return res.status(401).send({ error: "Unauthorized" });
  }

  let decoded: UserTokenPayload;
  try {
    decoded = fastify.jwt.verify<UserTokenPayload>(token);
  } catch (error) {
    console.error(error);
    return res.status(401).send({ error: "Unauthorized" });
  }

  req.tokenPayload = decoded;

  done();
});

export { fastify };
