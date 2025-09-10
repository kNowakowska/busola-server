import type { FastifyInstance } from "fastify";

import { signIn } from "../controllers/auth/signIn.controller";
import { signOut } from "../controllers/auth/signOut.controller";
import { resetPasswordRequest } from "../controllers/auth/resetPasswordRequest.controller";
import { verifyCode } from "../controllers/auth/verifyCode.controller";
import { resetPassword } from "../controllers/auth/resetPassword.controller";
import { resetInitialPassword } from "../controllers/auth/resetInitialPassword.controller";
import { refreshToken } from "../controllers/auth/refreshToken.controller";

import { handlerWrapper } from "../utils/handlerWrapper";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/sign-in",
    {
      schema: {
        tags: ["Auth"],
        summary: "Sign in",
        body: { $ref: "SignInRequest#" },
        response: {
          200: {
            allOf: [{ $ref: "SignInResponse#" }],
            example: {
              shouldResetPassword: true,
            },
          },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Email and password are required",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid credentials",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper((req, res) => signIn(req, res, fastify)),
  );

  fastify.post(
    "/auth/reset-initial-password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Reset initial password and sign in",
        body: { $ref: "ResetInitialPasswordRequest#" },
        response: {
          200: {
            allOf: [{ $ref: "MessageResponse#" }],
            example: {
              message: "Password reset successfully",
            },
          },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Password must be at least 8 characters",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid credentials",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper((req, res) => resetInitialPassword(req, res, fastify)),
  );

  fastify.post(
    "/auth/refresh-token",
    {
      schema: {
        tags: ["Auth"],
        summary: "Refresh access token using refresh token cookie",
        response: {
          200: {
            allOf: [{ $ref: "MessageResponse#" }],
            example: {
              message: "Token refreshed",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Refresh token not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper((req, res) => refreshToken(req, res, fastify)),
  );

  fastify.post(
    "/auth/reset-password-request",
    {
      schema: {
        tags: ["Auth"],
        summary: "Request password reset (send verification code)",
        body: { $ref: "ResetPasswordEmailRequest#" },
        response: {
          200: {
            allOf: [{ $ref: "MessageResponse#" }],
            example: {
              message: "Verification code sent",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(resetPasswordRequest),
  );

  fastify.post(
    "/auth/verify-code",
    {
      schema: {
        tags: ["Auth"],
        summary: "Verify password reset code",
        body: { $ref: "VerifyCodeRequest#" },
        response: {
          200: {
            allOf: [{ $ref: "MessageResponse#" }],
            example: {
              message: "Verification code verified",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid verification code",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(verifyCode),
  );

  fastify.post(
    "/auth/reset-password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Reset password",
        body: { $ref: "ResetPasswordRequest#" },
        response: {
          200: {
            allOf: [{ $ref: "MessageResponse#" }],
            example: {
              message: "Password reset successfully",
            },
          },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Password must be at least 8 characters",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid verification code",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(resetPassword),
  );

  fastify.post(
    "/auth/sign-out",
    {
      schema: {
        tags: ["Auth"],
        summary: "Sign out (clear cookies)",
        response: {
          200: {
            allOf: [{ $ref: "MessageResponse#" }],
            example: {
              message: "Signed out",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(signOut),
  );
}
