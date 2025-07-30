import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  const { data, error } = await resend.emails.send({
    from: "kNowakowska <mail@knowakowska.tech>",
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
