import { FastifyReply, FastifyRequest } from "fastify";

import { getUserByEmail } from "../../services/user.service";

type VerifyCodePayload = {
  email: string;
  code: string;
};

export async function verifyCode(
  req: FastifyRequest<{ Body: VerifyCodePayload }>,
  res: FastifyReply
) {
  const { email, code } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  console.log("Verifying code for user:", email, code);
  if (!code || user.verification_code !== code) {
    return res.status(401).send({ error: "Invalid verification code" });
  }

  return res.status(200).send({ message: "Verification code verified" });
}
