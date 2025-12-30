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
    console.error("Email and password are required");
    return res.status(400).send({ error: "Email i hasło są wymagane" });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    console.error("User not found");
    return res.status(404).send({ error: "Użytkownik nie odnaleziony" });
  }

  if (user.isPasswordReseted && user.password) {
    console.log("User is password reseted and has password");
    if (await verifyPassword(password, user.password)) {
      console.log("Password is correct. Generating new tokens");
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
          domain: process.env.NODE_ENV === "dev" ? undefined : ".onrender.com",
        })
        .setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "dev" ? false : true,
          sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: process.env.NODE_ENV === "dev" ? undefined : ".onrender.com",
        })
        .status(200)
        .send({ shouldResetPassword: false });
    } else {
      console.error("Password is incorrect");
      return res.status(401).send({ error: "Nieprawidłowe dane logowania" });
    }
  } else {
    console.log("User is not password reseted or does not have password");
    if (user.initialPassword === password) {
      console.log("Initial password is correct. Need to reset password");
      return res.status(200).send({ shouldResetPassword: true });
    } else {
      console.error("Initial password is incorrect");
      return res.status(401).send({ error: "Nieprawidłowe dane logowania" });
    }
  }
}
