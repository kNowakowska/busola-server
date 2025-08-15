import { FastifyReply, FastifyRequest } from "fastify";

import { getUserByEmail } from "../../services/database/user.service";

type VerifyCodePayload = {
  email: string;
  code: string;
};

export async function verifyCode(
  req: FastifyRequest<{ Body: string }>,
  res: FastifyReply
) {
  const { email, code } = JSON.parse(req.body) as VerifyCodePayload;

  const user = await getUserByEmail(email);
  if (!user) {
    console.error(`User not found for email: ${email}`);
    return res.status(404).send({ error: "User not found" });
  }

  console.log("Verifying code for user:", email, code);
  if (!code || user.verificationCode !== code) {
    console.error("Invalid verification code");
    return res.status(401).send({ error: "Invalid verification code" });
  }

  return res.status(200).send({ message: "Verification code verified" });
}
