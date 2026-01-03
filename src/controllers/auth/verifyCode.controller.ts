import type { FastifyReply, FastifyRequest } from "fastify";

import { getUserByEmail } from "../../services/database/user.service";

type VerifyCodePayload = {
  email: string;
  code: string;
};

export async function verifyCode(
  req: FastifyRequest<{ Body: VerifyCodePayload }>,
  res: FastifyReply,
) {
  const { email, code } = req.body;
  const user = await getUserByEmail(email, req.log);
  if (!user) {
    req.log.error({ msg: "User not found for email", email });
    return res.status(404).send({ error: "Użytkownik nie odnaleziony" });
  }

  req.log.info({ msg: "Verifying code for user", email, code });
  if (!code || user.verificationCode !== code) {
    req.log.error({
      msg: "Invalid verification code",
      email,
      code,
      userVerificationCode: user.verificationCode,
    });
    return res.status(401).send({ error: "Nieprawidłowy kod weryfikacyjny" });
  }

  return res.status(200).send({ message: "Kod został zweryfikowany" });
}
