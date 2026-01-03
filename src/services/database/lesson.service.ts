import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../../config/prisma";

import type { Lesson } from "../../generated/prisma";

import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { InvalidPayloadError } from "../../errors/InvalidPayloadError";

export async function getLessonByCmsId(cmsId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching lesson by cms id", cmsId });
  return prisma.lesson.findUnique({
    where: { cmsId },
  });
}

export async function updateLessonToCourse(
  lessonId: string,
  courseId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating lesson to course", lessonId, courseId });
  return prisma.lesson.update({
    where: { uuid: lessonId },
    data: { courseId },
  });
}

export async function upsertLesson(
  cmsId: string,
  data: {
    name: string;
    content: string;
    order: number;
    videoUrl?: string;
    tasksVideoUrl?: string;
    tasksFileCMSId?: string;
  },
  logger: FastifyBaseLogger,
) {
  logger.info({
    msg: "Upserting lesson",
    cmsId,
    data,
  });
  return prisma.lesson.upsert({
    where: { cmsId },
    update: { ...data },
    create: { ...data, cmsId },
  });
}

export async function getLessonById(
  lessonId: string,
  courseId: string,
  userId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Fetching lesson by id", lessonId, courseId, userId });
  const lesson = await prisma.lesson.findUnique({
    where: {
      uuid: lessonId,
    },
    select: {
      uuid: true,
      name: true,
      order: true,
      courseId: true,
      content: true,
      videoUrl: true,
      tasksVideoUrl: true,
      tasksFileCMSId: true,
      quiz: {
        select: {
          uuid: true,
        },
      },
      course: {
        select: {
          _count: {
            select: {
              users: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
      users: {
        select: {
          notes: true,
          isCompleted: true,
        },
        where: {
          userId,
        },
      },
    },
  });

  if (!lesson) throw new NotFoundError(`Lesson with id: ${lessonId} not found`);

  if (lesson.courseId !== courseId)
    throw new InvalidPayloadError("User doesn't have access to this lesson");

  const isRelatedToUser = (lesson.course?._count.users ?? 0) > 0;

  if (!isRelatedToUser) throw new ForbiddenError("User doesn't have access to this course");

  return lesson;
}

export async function getPreviousLessonId(
  lesson: Partial<Lesson> & Required<Pick<Lesson, "order" | "courseId">>,
) {
  if (lesson.order === 1) return null;

  const previousLesson = await prisma.lesson.findFirst({
    where: {
      courseId: lesson.courseId,
      order: lesson.order - 1,
    },
  });
  return previousLesson?.uuid;
}

export async function getNextLessonId(
  lesson: Partial<Lesson> & Required<Pick<Lesson, "order" | "courseId">>,
) {
  const nextLesson = await prisma.lesson.findFirst({
    where: {
      courseId: lesson.courseId,
      order: lesson.order + 1,
    },
  });
  return nextLesson?.uuid;
}

export async function saveNotesTolesson(
  lesson: Lesson,
  userId: string,
  notes: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Saving notes to lesson", lesson, userId, notes });
  return prisma.userToLesson.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: lesson.uuid,
      },
    },
    update: { notes },
    create: { userId, lessonId: lesson.uuid, notes },
    select: {
      isCompleted: true,
      notes: true,
      lesson: {
        select: {
          uuid: true,
          name: true,
          order: true,
          courseId: true,
          content: true,
          videoUrl: true,
        },
      },
    },
  });
}

export async function markLessonAsCompleted(
  lesson: Lesson,
  userId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Marking lesson as completed", lesson, userId });
  return prisma.userToLesson.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: lesson.uuid,
      },
    },
    update: { isCompleted: true },
    create: { userId, lessonId: lesson.uuid, isCompleted: true },
    select: {
      isCompleted: true,
      notes: true,
      lesson: {
        select: {
          uuid: true,
          name: true,
          order: true,
          courseId: true,
          content: true,
          videoUrl: true,
        },
      },
    },
  });
}
