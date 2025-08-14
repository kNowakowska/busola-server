import { prisma } from "../../config/prisma";

export async function createQuiz(name: string, cmsId: string) {
  console.log("Creating quiz:", name);
  return prisma.quiz.create({
    data: { name, cmsId },
  });
}

export async function getQuizByCmsId(cmsId: string) {
  return prisma.quiz.findUnique({
    where: { cmsId },
  });
}

export async function updateQuiz(quizId: string, name: string) {
  return prisma.quiz.update({
    where: { uuid: quizId },
    data: { name },
  });
}

export async function updateQuizToLesson(quizId: string, lessonId: string) {
  return prisma.quiz.update({
    where: { uuid: quizId },
    data: { lessonId },
  });
}

export async function upsertQuiz(cmsId: string, name: string) {
  return prisma.quiz.upsert({
    where: { cmsId },
    update: { name },
    create: { name, cmsId },
  });
}
