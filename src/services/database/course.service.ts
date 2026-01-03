import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../../config/prisma";

import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";

export async function upsertCourse(
  cmsId: string,
  data: {
    name: string;
    shortDescription: string;
    description: string;
    imageCMSId: string;
    videoUrl: string;
  },
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Upserting course", cmsId, data });
  return prisma.course.upsert({
    where: { cmsId },
    update: {
      ...data,
    },
    create: { ...data, cmsId },
  });
}

export async function getCourseWithLessonsById(
  courseId: string,
  userId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Fetching course by id", courseId, userId });
  const course = await prisma.course.findUnique({
    where: {
      uuid: courseId,
    },
    select: {
      uuid: true,
      name: true,
      shortDescription: true,
      description: true,
      imageCMSId: true,
      lessons: {
        select: {
          uuid: true,
          name: true,
          courseId: true,
          users: {
            select: {
              isCompleted: true,
            },
            where: {
              userId,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      users: {
        select: {
          createdAt: true,
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          users: { where: { userId } },
        },
      },
    },
  });

  if (!course) throw new NotFoundError(`Course with id: ${courseId} not found`);

  const isRelatedToUser = course._count.users > 0;

  if (!isRelatedToUser) throw new ForbiddenError("User doesn't have access to this course");

  return course;
}

export async function getCourseById(uuid: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching course by id", uuid });
  return prisma.course.findUnique({
    where: { uuid },
  });
}
