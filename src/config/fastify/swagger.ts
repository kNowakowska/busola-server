import { FastifyInstance } from "fastify";

import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export function swaggerConfig(fastify: FastifyInstance) {
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "Busola API",
        description: "API documentation for Busola server",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3050" }],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "access_token",
          },
        },
        schemas: {
          ErrorResponse: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
            required: ["error"],
          },
          UnauthorizedErrorResponse: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
            required: ["error"],
            example: {
              error: "Sesja wygasła",
            },
          },
          ServerErrorResponse: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
            required: ["error"],
            example: {
              error: "Coś poszło nie tak. Spróbuj ponownie później",
            },
          },
          MessageResponse: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
          SignInRequest: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string" },
            },
            required: ["email", "password"],
          },
          SignInResponse: {
            type: "object",
            properties: {
              shouldResetPassword: { type: "boolean" },
            },
            required: ["shouldResetPassword"],
          },
          ResetInitialPasswordRequest: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              initialPassword: { type: "string" },
              password: { type: "string" },
            },
            required: ["email", "initialPassword", "password"],
          },
          ResetPasswordRequest: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              code: { type: "string" },
              password: { type: "string" },
            },
            required: ["email", "code", "password"],
          },
          ResetPasswordEmailRequest: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
            },
            required: ["email"],
          },
          VerifyCodeRequest: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              code: { type: "string" },
            },
            required: ["email", "code"],
          },
          LessonListItem: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              name: { type: "string" },
              isCompleted: { type: "boolean" },
              courseId: { type: "string" },
            },
            required: ["uuid", "name", "isCompleted", "courseId"],
          },
          CourseListItem: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              name: { type: "string" },
              shortDescription: { type: "string" },
              imageCMSId: { type: "string" },
              lessonsCompleted: { type: "number" },
              lessonsCount: { type: "number" },
            },
            required: [
              "uuid",
              "name",
              "shortDescription",
              "imageCMSId",
              "lessonsCompleted",
              "lessonsCount",
            ],
          },
          User: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              name: { type: "string" },
              lastName: { type: "string" },
              email: { type: "string", format: "email" },
              courses: {
                type: "array",
                items: { $ref: "#/components/schemas/CourseListItem" },
              },
            },
            required: ["uuid", "name", "lastName", "email", "courses"],
          },
          Answer: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              text: { type: "string" },
            },
            required: ["uuid", "text"],
          },
          Question: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              text: { type: "string" },
              options: { type: "array", items: { $ref: "Answer#" } },
            },
            required: ["uuid", "text", "options"],
          },
          Quiz: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              name: { type: "string" },
              questions: { type: "array", items: { $ref: "Question#" } },
              attempts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    scoreInPercent: { type: "number" },
                    createdAt: { type: "string" },
                  },
                },
                required: ["scoreInPercent", "createdAt"],
              },
            },
            required: ["uuid", "name", "questions", "attempts"],
          },
          Course: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              shortDescription: { type: "string" },
              imageCMSId: { type: "string" },
              lessonsCompleted: { type: "number" },
              lessonsCount: { type: "number" },
              lessons: {
                type: "array",
                items: { $ref: "#/components/schemas/LessonListItem" },
              },
            },
            required: [
              "uuid",
              "name",
              "description",
              "shortDescription",
              "imageCMSId",
              "lessonsCompleted",
              "lessons",
              "lessonsCount",
            ],
          },
          Lesson: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              name: { type: "string" },
              content: { type: "object", additionalProperties: true },
              videoUrl: { type: "string" },
              previousLessonId: { type: "string", nullable: true },
              nextLessonId: { type: "string", nullable: true },
              order: { type: "number" },
              courseId: { type: "string" },
              isCompleted: { type: "boolean" },
              notes: { type: "string", nullable: true },
              quizId: { type: "string", nullable: true },
            },
            required: [
              "uuid",
              "name",
              "content",
              "videoUrl",
              "order",
              "courseId",
              "isCompleted",
            ],
          },
          SaveLessonNotesPayload: {
            type: "object",
            properties: {
              notes: { type: "string" },
            },
            required: ["notes"],
          },
          SaveQuizAnswersPayload: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    uuid: { type: "string" },
                    answer: { type: "string" },
                  },
                  required: ["uuid", "answer"],
                },
              },
            },
            required: ["questions"],
          },
          ContentfulEntryEvent: {
            type: "object",
            properties: {
              sys: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  contentType: {
                    type: "object",
                    properties: {
                      sys: {
                        type: "object",
                        properties: { id: { type: "string" } },
                        required: ["id"],
                      },
                    },
                    required: ["sys"],
                  },
                },
                required: ["id", "contentType"],
              },
              fields: { type: "object" },
            },
            required: ["sys", "fields"],
          },
        },
      },
    },
  });

  fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  // Register JSON Schemas for validation (Ajv) so $ref can resolve
  fastify.addSchema({
    $id: "ErrorResponse",
    type: "object",
    properties: { error: { type: "string" } },
    required: ["error"],
  });

  fastify.addSchema({
    $id: "UnauthorizedErrorResponse",
    type: "object",
    properties: { error: { type: "string" } },
    required: ["error"],
    example: {
      error: "Sesja wygasła",
    },
  });

  fastify.addSchema({
    $id: "ServerErrorResponse",
    type: "object",
    properties: { error: { type: "string" } },
    required: ["error"],
    example: {
      error: "Coś poszło nie tak. Spróbuj ponownie później",
    },
  });

  fastify.addSchema({
    $id: "MessageResponse",
    type: "object",
    properties: { message: { type: "string" } },
    required: ["message"],
  });

  fastify.addSchema({
    $id: "SignInRequest",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
    required: ["email", "password"],
  });

  fastify.addSchema({
    $id: "SignInResponse",
    type: "object",
    properties: { shouldResetPassword: { type: "boolean" } },
    required: ["shouldResetPassword"],
  });

  fastify.addSchema({
    $id: "ResetInitialPasswordRequest",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      initialPassword: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "initialPassword", "password"],
  });

  fastify.addSchema({
    $id: "ResetPasswordRequest",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      code: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "code", "password"],
  });

  fastify.addSchema({
    $id: "ResetPasswordEmailRequest",
    type: "object",
    properties: { email: { type: "string", format: "email" } },
    required: ["email"],
  });

  fastify.addSchema({
    $id: "VerifyCodeRequest",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      code: { type: "string" },
    },
    required: ["email", "code"],
  });

  fastify.addSchema({
    $id: "LessonListItem",
    type: "object",
    properties: {
      uuid: { type: "string" },
      name: { type: "string" },
      isCompleted: { type: "boolean" },
      courseId: { type: "string" },
    },
    required: ["uuid", "name", "isCompleted", "courseId"],
  });

  fastify.addSchema({
    $id: "CourseListItem",
    type: "object",
    properties: {
      uuid: { type: "string" },
      name: { type: "string" },
      shortDescription: { type: "string" },
      imageCMSId: { type: "string" },
      lessonsCompleted: { type: "number" },
      lessonsCount: {
        type: "number",
      },
    },
    required: [
      "uuid",
      "name",
      "shortDescription",
      "imageCMSId",
      "lessonsCompleted",
      "lessonsCount",
    ],
  });

  fastify.addSchema({
    $id: "Answer",
    type: "object",
    properties: {
      uuid: { type: "string" },
      text: { type: "string" },
    },
    required: ["uuid", "text"],
  });

  fastify.addSchema({
    $id: "Question",
    type: "object",
    properties: {
      uuid: { type: "string" },
      text: { type: "string" },
      options: { type: "array", items: { $ref: "Answer#" } },
    },
    required: ["uuid", "text", "options"],
  });

  fastify.addSchema({
    $id: "Quiz",
    type: "object",
    properties: {
      uuid: { type: "string" },
      name: { type: "string" },
      questions: { type: "array", items: { $ref: "Question#" } },
      attempts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            scoreInPercent: { type: "number" },
            createdAt: { type: "string" },
          },
        },
        required: ["scoreInPercent", "createdAt"],
      },
    },
    required: ["uuid", "name", "questions", "attempts"],
  });

  fastify.addSchema({
    $id: "Lesson",
    type: "object",
    properties: {
      uuid: { type: "string" },
      name: { type: "string" },
      content: { type: "object", additionalProperties: true },
      videoUrl: { type: "string" },
      previousLessonId: { type: "string", nullable: true },
      nextLessonId: { type: "string", nullable: true },
      order: { type: "number" },
      courseId: { type: "string" },
      isCompleted: { type: "boolean" },
      notes: { type: "string", nullable: true },
      quizId: { type: "string", nullable: true },
    },
    required: [
      "uuid",
      "name",
      "content",
      "videoUrl",
      "order",
      "courseId",
      "isCompleted",
    ],
  });

  fastify.addSchema({
    $id: "Course",
    type: "object",
    properties: {
      uuid: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      shortDescription: { type: "string" },
      imageCMSId: { type: "string" },
      lessonsCompleted: { type: "number" },
      lessonsCount: { type: "number" },
      lessons: { type: "array", items: { $ref: "LessonListItem#" } },
    },
    required: [
      "uuid",
      "name",
      "description",
      "shortDescription",
      "imageCMSId",
      "lessonsCompleted",
      "lessonsCount",
      "lessons",
    ],
  });

  fastify.addSchema({
    $id: "User",
    type: "object",
    properties: {
      uuid: { type: "string" },
      name: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string", format: "email" },
      courses: { type: "array", items: { $ref: "CourseListItem#" } },
    },
    required: ["uuid", "name", "lastName", "email", "courses"],
  });

  fastify.addSchema({
    $id: "SaveLessonNotesPayload",
    type: "object",
    properties: {
      notes: { type: "string" },
    },
    required: ["notes"],
  });

  fastify.addSchema({
    $id: "SaveQuizAnswersPayload",
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: { uuid: { type: "string" }, answer: { type: "string" } },
          required: ["uuid", "answer"],
        },
      },
    },
    required: ["questions"],
  });

  fastify.addSchema({
    $id: "ContentfulEntryEvent",
    type: "object",
    properties: {
      sys: {
        type: "object",
        properties: {
          id: { type: "string" },
          contentType: {
            type: "object",
            properties: {
              sys: {
                type: "object",
                properties: { id: { type: "string" } },
                required: ["id"],
              },
            },
            required: ["sys"],
          },
        },
        required: ["id", "contentType"],
      },
      fields: { type: "object" },
    },
    required: ["sys", "fields"],
  });
}
