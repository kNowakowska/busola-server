import { FastifyReply, FastifyRequest } from "fastify";

import {
  getUserByEmail,
  saveUserVerificationCode,
} from "../../services/database/user.service";
import { sendEmail } from "../../config/resend";

type ResetPasswordRequestPayload = {
  email: string;
};

export async function resetPasswordRequest(
  req: FastifyRequest<{ Body: ResetPasswordRequestPayload }>,
  res: FastifyReply
) {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  console.log("Generating verification code for user:", email);
  const code = Math.floor(100000 + Math.random() * 900000);

  await saveUserVerificationCode(email, code.toString());

  console.log("Sending email to user:", email);
  await sendEmail(
    email,
    "Password reset request",
    `Your verificationcode is <b>${code}</b>`
  );

  return res.status(200).send({ message: "Verification code sent" });
}
