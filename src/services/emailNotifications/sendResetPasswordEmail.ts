import { sendEmail } from "./sendEmail";
import { resetPasswordEmailTemplate } from "./templates/resetPasswordEmail";

export async function sendResetPasswordEmail(email: string, code: string) {
  await sendEmail(email, "BUSOLA: Resetowanie hasła", resetPasswordEmailTemplate(code));
}
