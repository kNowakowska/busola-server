import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UserTokenPayload } from "../../types/UserTokenPayload";

export async function refreshToken(
  req: FastifyRequest,
  res: FastifyReply,
  fastify: FastifyInstance,
) {
  const { refresh_token } = req.cookies;
  if (!refresh_token) {
    req.log.error("Refresh token not found");
    return res.status(401).send({ error: "Odświeżenie sesji nie powiodło się" });
  }

  const decodedRefreshToken = fastify.jwt.decode(refresh_token) as UserTokenPayload;

  if (!decodedRefreshToken) {
    return res.status(401).send({ error: "Odświeżenie sesji nie powiodło się" });
  }

  req.log.info({ msg: "Token verification for user", decodedToken: decodedRefreshToken });
  const token = fastify.jwt.sign(decodedRefreshToken);

  return res
    .setCookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev" ? false : true,
      sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
      path: "/",
      maxAge: 60 * 60, // 1 hour
      domain: process.env.NODE_ENV === "dev" ? undefined : process.env.COOKIE_DOMAIN,
    })
    .status(200)
    .send({ message: "Token odświeżony" });
}
