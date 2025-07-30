import { FastifyReply } from "fastify";

export async function signOut(res: FastifyReply) {
  return res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .status(200)
    .send({ message: "Signed out" });
}
