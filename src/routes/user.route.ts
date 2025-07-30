import { FastifyInstance } from "fastify";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/current-user", (req, res) => {
    // TODO: get user from database
    const user = req.user;
    return res.send({ user });
  });
}
