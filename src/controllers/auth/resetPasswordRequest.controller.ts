import type { FastifyReply, FastifyRequest } from "fastify";

import { getUserByEmail, saveUserVerificationCode } from "../../services/database/user.service";
import { sendResetPasswordEmail } from "../../services/emailNotifications/sendResetPasswordEmail";

type ResetPasswordRequestPayload = {
  email: string;
};

export async function resetPasswordRequest(
  req: FastifyRequest<{ Body: ResetPasswordRequestPayload }>,
  res: FastifyReply,
) {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    console.error(`User not found for email: ${email}`);
    return res.status(404).send({ error: "Użytkownik nie istnieje" });
  }

  console.log("Generating verification code for user:", email);
  const code = Math.floor(100000 + Math.random() * 900000);

  await saveUserVerificationCode(email, code.toString());

  console.log("Sending email to user:", email);
  await sendResetPasswordEmail(email, code.toString());

  return res.status(200).send({ message: "Kod weryfikacyjny wysłany" });
}
