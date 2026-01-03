import type { FastifyBaseLogger } from "fastify";

import { prisma } from "../../config/prisma";
import { NotFoundError } from "../../errors/NotFoundError";
import getRandomElementsFromArray from "../../utils/getRandomElementsFromArray";

export async function createQuiz(name: string, cmsId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Creating quiz", name, cmsId });
  return prisma.quiz.create({
    data: { name, cmsId },
  });
}

export async function getQuizByCmsId(cmsId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching quiz by cms id", cmsId });
  return prisma.quiz.findUnique({
    where: { cmsId },
  });
}

export async function getQuizById(uuid: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching quiz by id", uuid });
  return prisma.quiz.findUnique({
    where: { uuid },
    select: {
      uuid: true,
      name: true,
      questionsToDrawCount: true,
      questions: {
        select: {
          uuid: true,
          options: {
            select: {
              uuid: true,
              isCorrect: true,
            },
          },
        },
      },
      attempts: {
        select: {
          score: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function updateQuiz(quizId: string, name: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Updating quiz", quizId, name });
  return prisma.quiz.update({
    where: { uuid: quizId },
    data: { name },
  });
}

export async function updateQuizToLesson(
  quizId: string,
  lessonId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating quiz to lesson", quizId, lessonId });
  return prisma.quiz.update({
    where: { uuid: quizId },
    data: { lessonId },
  });
}

export async function upsertQuiz(
  cmsId: string,
  name: string,
  questionsToDrawCount: number,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Upserting quiz", cmsId, name, questionsToDrawCount });
  return prisma.quiz.upsert({
    where: { cmsId },
    update: { name, questionsToDrawCount },
    create: { name, cmsId, questionsToDrawCount },
  });
}

export async function getQuizWithRandomQuestions(quizId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Getting quiz with random questions", quizId });
  const quiz = await prisma.quiz.findUnique({
    where: { uuid: quizId },
    select: {
      uuid: true,
      name: true,
      questionsToDrawCount: true,
      questions: {
        select: {
          uuid: true,
          text: true,
          options: {
            select: {
              uuid: true,
              text: true,
            },
          },
        },
      },
      attempts: {
        select: {
          score: true,
          createdAt: true,
        },
      },
    },
  });
  if (!quiz) throw new NotFoundError(`Quiz with id: ${quizId} not found`);

  const questionsCount = quiz.questionsToDrawCount;
  const allQuestionsCount = quiz.questions.length;

  if (questionsCount >= allQuestionsCount) {
    return quiz;
  }

  quiz.questions = getRandomElementsFromArray(quiz.questions, questionsCount);

  return quiz;
}
