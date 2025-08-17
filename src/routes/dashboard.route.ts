import { FastifyInstance } from "fastify";

import { currentUser } from "../controllers/user/currentUser.controller";
import { handlerWrapper } from "../utils/handlerWrapper";

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/dashboard/current-user",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Get current user with assigned courses list",
        security: [{ cookieAuth: [] }],
        response: {
          200: { $ref: "User#" },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Unauthorized",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper((req, res) => currentUser(req, res, fastify))
  );

  fastify.get(
    "/dashboard/courses/:courseId",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Get course by id with list of lessons",
        params: {
          type: "object",
          properties: {
            courseId: { type: "string" },
          },
          required: ["courseId"],
        },
        security: [{ cookieAuth: [] }],
        response: {
          200: { $ref: "Course#" },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid courseId",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Unauthorized",
            },
          },
          403: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User doesn't have access to this course",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Course not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    (_req, res) => {
      // TODO: Implement course by id
      return res.status(200);
    }
  );

  fastify.get(
    "/dashboard/courses/:courseId/lessons/:lessonId",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Get lesson by id",
        params: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            lessonId: { type: "string" },
          },
          required: ["courseId", "lessonId"],
        },
        security: [{ cookieAuth: [] }],
        response: {
          200: { $ref: "Lesson#" },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid courseId or lessonId",
            },
          },
          401: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Unauthorized",
            },
          },
          403: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "User doesn't have access to this course",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Lesson not found",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    (_req, res) => {
      // TODO: Implement lesson by id
      return res.status(200);
    }
  );
}
