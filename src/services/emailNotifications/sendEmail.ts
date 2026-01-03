import type { FastifyBaseLogger } from "fastify";
import resend from "../../config/resend";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  logger: FastifyBaseLogger,
) {
  if (!process.env.EMAIL_OVERWRITE && process.env.NODE_ENV !== "prod") {
    throw new Error("EMAIL_OVERWRITE is not set");
  }

  const toEmail = process.env.NODE_ENV === "prod" ? to : process.env.EMAIL_OVERWRITE!;

  logger.info({ msg: "Sending email to", toEmail, env: process.env.NODE_ENV });

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: [toEmail],
    subject,
    html,
  });

  if (error) {
    logger.error({ msg: "Error sending email", error });
    return null;
  }

  logger.info({ msg: "Email sent successfully", data });
  return data;
}
