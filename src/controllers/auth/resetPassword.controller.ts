import { FastifyReply, FastifyRequest } from "fastify";

import {
  getUserByEmail,
  updateUserPassword,
} from "../../services/database/user.service";
import { hashPassword } from "../../utils/hashPassword";
import { password as passwordValidator } from "../../validators/password";

type ResetPasswordPayload = {
  email: string;
  code: string;
  password: string;
};

export async function resetPassword(
  req: FastifyRequest<{ Body: ResetPasswordPayload }>,
  res: FastifyReply
) {
  const { email, code, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    console.error(`User not found for email: ${email}`);
    return res.status(404).send({ error: "Użytkownik nie odnaleziony" });
  }

  if (!code || user.verificationCode !== code) {
    console.error("Invalid verification code", user.verificationCode, code);
    return res.status(401).send({ error: "Nieprawidłowy kod weryfikacyjny" });
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

  return res.status(200).send({ message: "Hasło zostało zresetowane" });
}
