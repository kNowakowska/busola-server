import type { FastifyInstance } from "fastify";

import { handlerWrapper } from "../utils/handlerWrapper";
import { getPosts } from "../controllers/blog/getPosts.controller";

export async function blogRoutes(fastify: FastifyInstance) {
  fastify.post("/blog/posts", handlerWrapper(getPosts));
}
