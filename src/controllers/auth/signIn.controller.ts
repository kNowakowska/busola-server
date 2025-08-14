import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getUserByEmail } from "../../services/database/user.service";
import { verifyPassword } from "../../utils/hashPassword";

type SignInPayload = {
  email: string;
  password: string;
};

export async function signIn(
  req: FastifyRequest<{ Body: SignInPayload }>,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  const { password, email } = req.body as SignInPayload;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  if (user.isPasswordReseted && user.password) {
    console.log("User is password reseted and has password");
    if (await verifyPassword(password, user.password)) {
      console.log("Password is correct. Generating new tokens");
      const token = fastify.jwt.sign({ username: email });
      const refreshToken = fastify.jwt.sign(
        { username: email },
        {
          key: process.env.JWT_REFRESH_SECRET!,
          expiresIn: "7d",
        }
      );

      return res
        .setCookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60, // 1 hour
        })
        .setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        .status(200)
        .send({ shouldResetPassword: false });
    } else {
      console.log("Password is incorrect");
      return res.status(401).send({ error: "Invalid credentials" });
    }
  } else {
    console.log("User is not password reseted or does not have password");
    if (user.initialPassword === password) {
      console.log("Initial password is correct. Need to reset password");
      return res.status(200).send({ shouldResetPassword: true });
    } else {
      console.log("Initial password is incorrect");
      return res.status(401).send({ error: "Invalid credentials" });
    }
  }
}
