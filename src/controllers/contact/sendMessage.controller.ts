import type { FastifyReply, FastifyRequest } from "fastify";

import { sendEmail } from "../../services/emailNotifications/sendEmail";

export async function sendMessage(req: FastifyRequest, res: FastifyReply) {
  const { name, email, phone, message } = req.body as {
    name: string;
    email: string;
    phone?: string;
    message: string;
  };

  if (!name || !email || !message) {
    return res.status(400).send({ error: "All fields are required" });
  }

  await sendEmail(
    process.env.CONTACT_EMAIL!,
    "Nowa wiadomość z formularza kontaktowego",
    `<h3>Nowa wiadomość z formularza kontaktowego</h3>
    <p><strong>Imie:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${phone || "Nie podano"}</p>
    <p><strong>Wiadomość:</strong> ${message}</p>`,
    req.log,
  );

  return res.status(200).send({ message: "Wiadomość została wysłana" });
}
