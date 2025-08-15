import { FastifyInstance } from "fastify";

import { currentUser } from "../controllers/user/currentUser.controller";
import { handlerWrapper } from "../utils/handlerWrapper";

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/user/current-user",
    handlerWrapper((req, res) => currentUser(req, res, fastify))
  );
}
