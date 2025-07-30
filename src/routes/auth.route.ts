import { FastifyInstance } from "fastify";

import { signIn } from "../controllers/auth/signIn.controller";
import { signOut } from "../controllers/auth/signOut.controller";
import { resetPasswordRequest } from "../controllers/auth/resetPasswordRequest.controller";
import { verifyCode } from "../controllers/auth/verifyCode.controller";
import { resetPassword } from "../controllers/auth/resetPassword.controller";
import { resetInitialPassword } from "../controllers/auth/resetInitialPassword.controller";
import { refreshToken } from "../controllers/auth/refreshToken.controller";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/sign-in", (req, res) => signIn(req, res, fastify));
  fastify.post("/auth/reset-initial-password", (req, res) =>
    resetInitialPassword(req, res, fastify)
  );
  fastify.post("/auth/refresh-token", (req, res) =>
    refreshToken(req, res, fastify)
  );

  fastify.post("/auth/reset-password-request", resetPasswordRequest);
  fastify.post("/auth/verify-code", verifyCode);
  fastify.post("/auth/reset-password", resetPassword);

  fastify.post("/auth/sign-out", signOut);
}
