import { prisma } from "../../config/prisma";

import { Lesson } from "../../generated/prisma";

import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { InvalidPayloadError } from "../../errors/InvalidPayloadError";

export async function getLessonByCmsId(cmsId: string) {
  return prisma.lesson.findUnique({
    where: { cmsId },
  });
}

export async function updateLessonToCourse(lessonId: string, courseId: string) {
  return prisma.lesson.update({
    where: { uuid: lessonId },
    data: { courseId },
  });
}

export async function upsertLesson(
  cmsId: string,
  name: string,
  content: string,
  order: number,
  videoUrl?: string
) {
  return prisma.lesson.upsert({
    where: { cmsId },
    update: { name, content, videoUrl, order },
    create: { name, content, videoUrl, order, cmsId },
  });
}

export async function getLessonById(
  lessonId: string,
  courseId: string,
  userId: string
) {
  console.log(
    `Fetching lesson by id: ${lessonId} for course: ${courseId} and user: ${userId}`
  );
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

  if (!isRelatedToUser)
    throw new ForbiddenError("User doesn't have access to this course");

  return lesson;
}

export async function getPreviousLessonId(
  lesson: Partial<Lesson> & Required<Pick<Lesson, "order" | "courseId">>
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
  lesson: Partial<Lesson> & Required<Pick<Lesson, "order" | "courseId">>
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
  notes: string
) {
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

export async function markLessonAsCompleted(lesson: Lesson, userId: string) {
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
