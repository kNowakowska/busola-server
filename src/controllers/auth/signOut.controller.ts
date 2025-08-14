import { FastifyReply, FastifyRequest } from "fastify";

export async function signOut(_req: FastifyRequest, res: FastifyReply) {
  return res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .status(200)
    .send({ message: "Signed out" });
}
