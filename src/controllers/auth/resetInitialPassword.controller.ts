import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  getUserByEmail,
  updateUserPassword,
} from "../../services/database/user.service";
import { hashPassword } from "../../utils/hashPassword";
import { password as passwordValidator } from "../../validators/password";

type ResetInitialPasswordPayload = {
  email: string;
  initialPassword: string;
  password: string;
};

export async function resetInitialPassword(
  req: FastifyRequest<{ Body: ResetInitialPasswordPayload }>,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  const { password, initialPassword, email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  if (user.initialPassword !== initialPassword) {
    console.log("Initial password is incorrect");
    return res.status(401).send({ error: "Invalid credentials" });
  }

  console.log("Validating new password", password);
  const validatedPassword = passwordValidator().safeParse(password);
  if (!validatedPassword.success) {
    return res
      .status(400)
      .send({ error: validatedPassword.error.issues[0].message });
  }

  const hashedPassword = await hashPassword(validatedPassword.data);
  await updateUserPassword(email, hashedPassword);

  console.log("Generating new tokens for user:", email);
  const token = fastify.jwt.sign({ email, userId: user.uuid });
  const refreshToken = fastify.jwt.sign(
    { email, userId: user.uuid },
    {
      key: process.env.JWT_REFRESH_SECRET!,
      expiresIn: "7d",
    }
  );

  return res
    .setCookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    })
    .setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    .status(200)
    .send({ message: "Password reset successfully" });
}
