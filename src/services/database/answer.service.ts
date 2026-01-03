import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../../config/prisma";

export async function createAnswer(
  answer: string,
  isCorrect: boolean,
  cmsId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating answer", answer });
  return prisma.answer.create({
    data: { text: answer, isCorrect, cmsId },
  });
}

export async function getAnswerByCmsId(cmsId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Getting answer by cms id", cmsId });
  return prisma.answer.findUnique({
    where: { cmsId },
  });
}

export async function updateAnswer(
  answerId: string,
  answer: string,
  isCorrect: boolean,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating answer", answerId, answer, isCorrect });
  return prisma.answer.update({
    where: { uuid: answerId },
    data: { text: answer, isCorrect },
  });
}

export async function upsertAnswer(
  cmsId: string,
  answer: string,
  isCorrect: boolean,
  imageCMSId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Upserting answer", cmsId, answer, isCorrect, imageCMSId });
  return prisma.answer.upsert({
    where: { cmsId },
    update: { text: answer, isCorrect, imageCMSId },
    create: { text: answer, isCorrect, cmsId, imageCMSId },
  });
}

export async function updateAnswerToQuestion(
  answerId: string,
  questionId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating answer to question", answerId, questionId });
  return prisma.answer.update({
    where: { uuid: answerId },
    data: { questionId },
  });
}
