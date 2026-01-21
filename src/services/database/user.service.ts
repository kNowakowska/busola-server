import type { FastifyBaseLogger } from "fastify";
import { omit } from "lodash";

import { prisma } from "../../config/prisma";

export async function getUserByEmail(email: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching user by email", email });
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserById(id: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching user by id", id });
  return prisma.user.findUnique({
    where: {
      uuid: id,
    },
  });
}

export async function updateUserPassword(
  data: {
    email: string;
    password: string;
    name: string;
    lastName: string;
  },
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating user password for", email: data.email });
  return prisma.user.update({
    where: { email: data.email },
    data: { ...omit(data, "email"), isPasswordReseted: true },
  });
}

export async function saveUserVerificationCode(
  email: string,
  code: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Saving user verification code for", email, code });
  return prisma.user.update({
    where: { email },
    data: { verificationCode: code.toString() },
  });
}

export async function getUserWithCoursesByUserId(userId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching user with courses by user id", userId });
  return prisma.user.findUnique({
    where: {
      uuid: userId,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      lastName: true,
      courses: {
        select: {
          course: {
            select: {
              uuid: true,
              name: true,
              shortDescription: true,
              imageCMSId: true,
              lessons: {
                select: {
                  users: {
                    select: {
                      isCompleted: true,
                    },
                    where: {
                      userId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function upsertUser(
  email: string,
  initialPassword: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Upserting user for", email, initialPassword });
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, initialPassword },
  });
}

export async function assignCourseToUser(
  userId: string,
  courseId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Assigning course to user", userId, courseId });
  return prisma.userToCourse.create({
    data: { userId, courseId },
  });
}

export async function updateUserSlackChannel(
  id: string,
  slackChannel: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating user slack channel for id", id });
  return prisma.user.update({
    where: { uuid: id },
    data: { slackChannel },
  });
}

export async function getUserBySlackChannelId(slackChannelId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching user by slackChannelId", slackChannelId });
  return prisma.user.findUnique({
    where: {
      slackChannel: slackChannelId,
    },
  });
}
