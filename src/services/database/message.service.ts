import { prisma } from "../../config/prisma";

export async function getMessages(userId: string, pageSize = 20, page = 0) {
  console.log("Getting messages for user:", userId, "pageSize:", pageSize, "page:", page);
  const skip = +page * +pageSize;

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
    },
  });
}
