import { prisma } from "../../config/prisma";

type LessonCreateInput = {
  name: string;
  content: any;
  videoUrl?: string;
  order: number;
  cmsId: string;
};

export async function createLesson(lesson: LessonCreateInput) {
  console.log("Creating lesson:", lesson.name);
  return prisma.lesson.create({
    data: { ...lesson },
  });
}

export async function getLessonByCmsId(cmsId: string) {
  return prisma.lesson.findUnique({
    where: { cmsId },
  });
}

export async function updateLesson(
  lessonId: string,
  lesson: LessonCreateInput
) {
  return prisma.lesson.update({
    where: { uuid: lessonId },
    data: { ...lesson },
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
