import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../../config/prisma";

export async function getMessages(
  userId: string,
  pageSize = 10,
  skip = 0,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Getting messages for user", userId, pageSize, skip });

  return prisma.message.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: +pageSize,
    skip,
  });
}

export async function createMessage(
  userId: string,
  message: string,
  fromTeacher = false,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating message", userId, message, fromTeacher });
  return prisma.message.create({
    data: {
      userId,
      message,
      fromTeacher,
      isViewed: !fromTeacher,
    },
  });
}

export async function markMessageAsViewed(
  userId: string,
  messageId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Marking message as viewed", userId, messageId });
  return prisma.message.update({
    where: {
      uuid: messageId,
      userId,
    },
    data: {
      isViewed: true,
    },
  });
}
