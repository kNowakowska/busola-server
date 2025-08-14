import { prisma } from "../../config/prisma";

export async function createAnswer(
  answer: string,
  isCorrect: boolean,
  cmsId: string
) {
  console.log("Creating answer:", answer);
  return prisma.answer.create({
    data: { text: answer, isCorrect, cmsId },
  });
}

export async function getAnswerByCmsId(cmsId: string) {
  return prisma.answer.findUnique({
    where: { cmsId },
  });
}

export async function updateAnswer(
  answerId: string,
  answer: string,
  isCorrect: boolean
) {
  return prisma.answer.update({
    where: { uuid: answerId },
    data: { text: answer, isCorrect },
  });
}

export async function upsertAnswer(
  cmsId: string,
  answer: string,
  isCorrect: boolean
) {
  return prisma.answer.upsert({
    where: { cmsId },
    update: { text: answer, isCorrect },
    create: { text: answer, isCorrect, cmsId },
  });
}

export async function updateAnswerToQuestion(
  answerId: string,
  questionId: string
) {
  return prisma.answer.update({
    where: { uuid: answerId },
    data: { questionId },
  });
}
