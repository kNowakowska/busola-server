import { FastifyReply, FastifyRequest } from "fastify";

import {
  getUserByEmail,
  updateUserPassword,
} from "../../services/user.service";
import { hashPassword } from "../../utils/hashPassword";
import { password as passwordValidator } from "../../validators/password";

type ResetPasswordPayload = {
  email: string;
  verificationCode: string;
  password: string;
};

export async function resetPassword(
  req: FastifyRequest<{ Body: ResetPasswordPayload }>,
  res: FastifyReply
) {
  const { email, verificationCode, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  if (!verificationCode || user.verification_code !== verificationCode) {
    return res.status(401).send({ error: "Invalid verification code" });
  }

  console.log("Validating new password", password);
  const validatedPassword = passwordValidator().safeParse(password);
  if (!validatedPassword.success) {
    return res
      .status(400)
      .send({ error: validatedPassword.error.issues[0].message });
  }

  const hashedPassword = await hashPassword(password);
  await updateUserPassword(email, hashedPassword);

  return res.status(200).send({ message: "Password reset successfully" });
}
