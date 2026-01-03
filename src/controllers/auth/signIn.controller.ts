import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getUserByEmail } from "../../services/database/user.service";
import { verifyPassword } from "../../utils/hashPassword";

type SignInPayload = {
  email: string;
  password: string;
};

export async function signIn(
  req: FastifyRequest<{ Body: SignInPayload }>,
  res: FastifyReply,
  fastify: FastifyInstance,
) {
  const { password, email } = req.body;

  if (!email || !password) {
    req.log.error({ msg: "Email and password are required", email, password });
    return res.status(400).send({ error: "Email i hasło są wymagane" });
  }

  const user = await getUserByEmail(email, req.log);
  if (!user) {
    req.log.error({ msg: "User not found", email });
    return res.status(404).send({ error: "Użytkownik nie odnaleziony" });
  }

  if (user.isPasswordReseted && user.password) {
    req.log.info({ msg: "User is password reseted and has password", email });
    if (await verifyPassword(password, user.password)) {
      req.log.info({ msg: "Password is correct. Generating new tokens", email });
      const token = fastify.jwt.sign({ email, userId: user.uuid });
      const refreshToken = fastify.jwt.sign(
        { email, userId: user.uuid },
        {
          key: process.env.JWT_REFRESH_SECRET!,
          expiresIn: "7d",
        },
      );

      return res
        .setCookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "dev" ? false : true,
          sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
          path: "/",
          maxAge: 60 * 60, // 1 hour
          domain: process.env.NODE_ENV === "dev" ? undefined : process.env.COOKIE_DOMAIN,
        })
        .setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "dev" ? false : true,
          sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: process.env.NODE_ENV === "dev" ? undefined : process.env.COOKIE_DOMAIN,
        })
        .status(200)
        .send({ shouldResetPassword: false });
    } else {
      req.log.error({ msg: "Password is incorrect", email, password, userPassword: user.password });
      return res.status(401).send({ error: "Nieprawidłowe dane logowania" });
    }
  } else {
    req.log.info({ msg: "User is not password reseted or does not have password", email });
    if (user.initialPassword === password) {
      req.log.info({
        msg: "Initial password is correct. Need to reset password",
        email,
      });
      return res.status(200).send({ shouldResetPassword: true });
    } else {
      req.log.error({
        msg: "Initial password is incorrect",
        email,
        password,
        userInitialPassword: user.initialPassword,
      });
      return res.status(401).send({ error: "Nieprawidłowe dane logowania" });
    }
  }
}
