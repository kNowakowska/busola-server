import type { FastifyInstance } from "fastify";

import { handlerWrapper } from "../utils/handlerWrapper";

import { getCurrentUser } from "../controllers/dashboard/getCurrentUser.controller";
import { getCourse } from "../controllers/dashboard/getCourse.controller";
import { getLesson } from "../controllers/dashboard/getLesson.controller";
import { saveNotes } from "../controllers/dashboard/saveNotes.controller";
import { completeLesson } from "../controllers/dashboard/completeLesson.controller";
import { getQuiz } from "../controllers/dashboard/getQuiz.controller";
import { saveQuizAnswers } from "../controllers/dashboard/saveQuizAnswers.controller";

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
          401: { $ref: "UnauthorizedErrorResponse#" },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(getCurrentUser),
  );

  fastify.get(
    "/dashboard/course/:courseId",
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
          401: { $ref: "UnauthorizedErrorResponse#" },
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
    handlerWrapper(getCourse),
  );

  fastify.get(
    "/dashboard/course/:courseId/lesson/:lessonId",
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
          401: { $ref: "UnauthorizedErrorResponse#" },
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
    handlerWrapper(getLesson),
  );

  fastify.post(
    "/dashboard/course/:courseId/lesson/:lessonId/notes",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Save notes to lesson",
        params: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            lessonId: { type: "string" },
          },
          required: ["courseId", "lessonId"],
        },
        body: { $ref: "SaveLessonNotesPayload#" },
        security: [{ cookieAuth: [] }],
        response: {
          200: { $ref: "Lesson#" },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Invalid courseId or lessonId",
            },
          },
          401: { $ref: "UnauthorizedErrorResponse#" },
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
    handlerWrapper(saveNotes),
  );

  fastify.post(
    "/dashboard/course/:courseId/lesson/:lessonId/complete",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Mark lesson as completed",
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
          401: { $ref: "UnauthorizedErrorResponse#" },
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
    handlerWrapper(completeLesson),
  );

  fastify.get(
    "/dashboard/course/:courseId/lesson/:lessonId/quiz/:quizId",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Get quiz by id",
        params: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            lessonId: { type: "string" },
            quizId: { type: "string" },
          },
          required: ["courseId", "lessonId", "quizId"],
        },
        security: [{ cookieAuth: [] }],
        response: {
          200: { $ref: "Quiz#" },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Nieprawidłowy identyfikator quizu",
            },
          },
          401: { $ref: "UnauthorizedErrorResponse#" },
          403: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Użytkownik nie ma dostępu do tej lekcji quizu",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Quiz nie znaleziony",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(getQuiz),
  );

  fastify.post(
    "/dashboard/course/:courseId/lesson/:lessonId/quiz/:quizId",
    {
      schema: {
        tags: ["Dashboard"],
        summary: "Send quiz answers",
        params: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            lessonId: { type: "string" },
            quizId: { type: "string" },
          },
          required: ["courseId", "lessonId", "quizId"],
        },
        body: { $ref: "SaveQuizAnswersPayload#" },
        security: [{ cookieAuth: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              scoreInPercent: { type: "number" },
              createdAt: { type: "string" },
            },
            required: ["scoreInPercent", "createdAt"],
          },
          400: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Nieprawidłowy identyfikator quizu",
            },
          },
          401: { $ref: "UnauthorizedErrorResponse#" },
          403: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Użytkownik nie ma dostępu do tej lekcji quizu",
            },
          },
          404: {
            allOf: [{ $ref: "ErrorResponse#" }],
            example: {
              error: "Quiz nie znaleziony",
            },
          },
          500: { $ref: "ServerErrorResponse#" },
        },
      },
    },
    handlerWrapper(saveQuizAnswers),
  );
}
