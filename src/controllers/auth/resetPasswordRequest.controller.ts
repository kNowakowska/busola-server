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

  const user = await getUserByEmail(email, req.log);
  if (!user) {
    req.log.error({ msg: "User not found for email", email });
    return res.status(404).send({ error: "Użytkownik nie istnieje" });
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  req.log.info({ msg: "Verification code generated", code, email });
  await saveUserVerificationCode(email, code.toString(), req.log);

  req.log.info({ msg: "Sending email to user", email });
  await sendResetPasswordEmail(email, code.toString(), req.log);

  return res.status(200).send({ message: "Kod weryfikacyjny wysłany" });
}
