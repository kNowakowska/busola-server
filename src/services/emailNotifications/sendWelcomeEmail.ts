import type { FastifyBaseLogger } from "fastify";
import { sendEmail } from "./sendEmail";
import { welcomeEmailTemplate } from "./templates/welcomeEmail";

export async function sendWelcomeEmail(
  email: string,
  initialPassword: string,
  logger: FastifyBaseLogger,
) {
  await sendEmail(
    email,
    "BUSOLA: Dostęp do serwisu",
    welcomeEmailTemplate(email, initialPassword),
    logger,
  );
}
