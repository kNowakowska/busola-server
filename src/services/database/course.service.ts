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
) {
  return prisma.course.upsert({
    where: { cmsId },
    update: {
      ...data,
    },
    create: { ...data, cmsId },
  });
}

export async function getCourseWithLessonsById(courseId: string, userId: string) {
  console.log(`Fetching course by id: ${courseId} for user: ${userId}`);
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
