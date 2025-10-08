import { sendEmail } from "./sendEmail";
import { welcomeEmailTemplate } from "./templates/welcomeEmail";

export async function sendWelcomeEmail(email: string, initialPassword: string) {
  await sendEmail(email, "BUSOLA: Dostęp do serwisu", welcomeEmailTemplate(email, initialPassword));
}
