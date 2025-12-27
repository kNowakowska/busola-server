import { sendEmail } from "./sendEmail";
import { messageNotificationEmail } from "./templates/messageNotificationEmail";

export async function sendMessageNotificationEmail(email: string) {
  await sendEmail(email, "BUSOLA: Nowa wiadomość w Busoli", messageNotificationEmail());
}
