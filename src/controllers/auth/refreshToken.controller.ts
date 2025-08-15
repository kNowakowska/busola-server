import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserTokenPayload } from "../../types/UserTokenPayload";

export async function refreshToken(
  req: FastifyRequest,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  const { refresh_token } = req.cookies;
  if (!refresh_token) {
    return res.status(401).send({ error: "Refresh token not found" });
  }

  const decodedRefreshToken = fastify.jwt.decode(
    refresh_token
  ) as UserTokenPayload;

  if (!decodedRefreshToken) {
    return res.status(401).send({ error: "Invalid refresh token" });
  }

  console.log("Token verification for user:", decodedRefreshToken);
  const token = fastify.jwt.sign(decodedRefreshToken);

  return res
    .setCookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    })
    .status(200)
    .send({ message: "Token refreshed" });
}
