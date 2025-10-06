import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UserTokenPayload } from "../../types/UserTokenPayload";

export async function refreshToken(
  req: FastifyRequest,
  res: FastifyReply,
  fastify: FastifyInstance,
) {
  const { refresh_token } = req.cookies;
  if (!refresh_token) {
    console.error("Refresh token not found");
    return res.status(401).send({ error: "Odświeżenie sesji nie powiodło się" });
  }

  const decodedRefreshToken = fastify.jwt.decode(refresh_token) as UserTokenPayload;

  if (!decodedRefreshToken) {
    return res.status(401).send({ error: "Odświeżenie sesji nie powiodło się" });
  }

  console.log("Token verification for user:", decodedRefreshToken);
  const token = fastify.jwt.sign(decodedRefreshToken);

  return res
    .setCookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: process.env.NODE_ENV === "prod" ? "lax" : "none",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    })
    .status(200)
    .send({ message: "Token odświeżony" });
}
