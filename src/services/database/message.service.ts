import { prisma } from "../../config/prisma";

export async function getMessages(userId: string, pageSize = 10, skip = 0) {
  console.log("Getting messages for user:", userId, "pageSize:", pageSize, "skip:", skip);

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

export async function createMessage(userId: string, message: string, fromTeacher = false) {
  console.log("Creating message:", message, " for user:", userId);
  return prisma.message.create({
    data: {
      userId,
      message,
      fromTeacher,
      isViewed: !fromTeacher,
    },
  });
}

export async function markMessageAsViewed(userId: string, messageId: string) {
  console.log("Marking message as viewed:", messageId, " for user:", userId);
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
