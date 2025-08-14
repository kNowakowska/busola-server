import { FastifyInstance } from "fastify";

import { signIn } from "../controllers/auth/signIn.controller";
import { signOut } from "../controllers/auth/signOut.controller";
import { resetPasswordRequest } from "../controllers/auth/resetPasswordRequest.controller";
import { verifyCode } from "../controllers/auth/verifyCode.controller";
import { resetPassword } from "../controllers/auth/resetPassword.controller";
import { resetInitialPassword } from "../controllers/auth/resetInitialPassword.controller";
import { refreshToken } from "../controllers/auth/refreshToken.controller";

import { handlerWrapper } from "../utils/handlerWrapper";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/sign-in", handlerWrapper(signIn));
  fastify.post(
    "/auth/reset-initial-password",
    handlerWrapper(resetInitialPassword)
  );
  fastify.post("/auth/refresh-token", handlerWrapper(refreshToken));

  fastify.post(
    "/auth/reset-password-request",
    handlerWrapper(resetPasswordRequest)
  );
  fastify.post("/auth/verify-code", handlerWrapper(verifyCode));
  fastify.post("/auth/reset-password", handlerWrapper(resetPassword));

  fastify.post("/auth/sign-out", handlerWrapper(signOut));
}
