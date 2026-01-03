import type { FastifyBaseLogger } from "fastify";

import { sendEmail } from "./sendEmail";
import { messageNotificationEmail } from "./templates/messageNotificationEmail";

export async function sendMessageNotificationEmail(email: string, logger: FastifyBaseLogger) {
  await sendEmail(email, "BUSOLA: Nowa wiadomość w Busoli", messageNotificationEmail(), logger);
}
