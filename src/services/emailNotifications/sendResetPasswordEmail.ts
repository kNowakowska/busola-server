import type { FastifyBaseLogger } from "fastify";
import { sendEmail } from "./sendEmail";
import { resetPasswordEmailTemplate } from "./templates/resetPasswordEmail";

export async function sendResetPasswordEmail(
  email: string,
  code: string,
  logger: FastifyBaseLogger,
) {
  await sendEmail(email, "BUSOLA: Resetowanie hasła", resetPasswordEmailTemplate(code), logger);
}
