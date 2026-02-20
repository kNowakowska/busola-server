import type { FastifyReply, FastifyRequest } from "fastify";
import Fastify from "fastify";

import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";

import { swaggerConfig } from "./swagger";
import type { UserTokenPayload } from "../../types/UserTokenPayload";

declare module "fastify" {
  interface FastifyRequest {
    tokenPayload: UserTokenPayload;
  }
}

const fastify = Fastify({ logger: true });

function verifyToken(req: FastifyRequest, res: FastifyReply, token?: string) {
  if (!token) {
    req.log.error("No token found");
    return res.status(401).send({ error: "Unauthorized" });
  }

  let decoded: UserTokenPayload;
  try {
    decoded = fastify.jwt.verify<UserTokenPayload>(token);
  } catch (error) {
    req.log.error(error);
    return res.status(401).send({ error: "Sesja wygasła" });
  }

  req.tokenPayload = decoded;
}

fastify.register(fastifyCookie, {
  secret: process.env.JWT_SECRET!,
  parseOptions: {
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
    domain: process.env.NODE_ENV === "dev" ? undefined : process.env.COOKIE_DOMAIN,
  },
});

fastify.register(fastifyJWT, {
  secret: process.env.JWT_SECRET_KEY!,
});

fastify.register(cors, {
  origin: [process.env.FRONTEND_URL!],
  methods: ["GET", "POST", "OPTIONS", "HEAD"],
  credentials: true,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

fastify.register(websocket);

swaggerConfig(fastify);

fastify.addHook("onRequest", (req, res, done) => {
  if (req.url.includes("/webhook/websocket")) {
    const { token } = req.query as { token: string };

    verifyToken(req, res, token);

    done();
    return;
  }

  if (
    req.url.includes("/auth") ||
    req.url.includes("/blog") ||
    req.url.includes("/webhook/chat") ||
    req.url.includes("/contact")
  ) {
    done();
    return;
  }

  if (req.url.includes("/webhook") && !req.url.includes("/webhook/websocket")) {
    const { authorization } = req.headers;
    if (authorization !== process.env.WEBHOOK_SECRET) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    done();
    return;
  }

  const token = req.cookies?.access_token;

  verifyToken(req, res, token);

  done();
});

export { fastify };
