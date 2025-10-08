import resend from "../../config/resend";

export async function sendEmail(to: string, subject: string, html: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: [to],
    subject,
    html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log("Email sent successfully", data);
  return data;
}
