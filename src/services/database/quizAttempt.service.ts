import type { FastifyBaseLogger } from "fastify";
import { prisma } from "../../config/prisma";

export async function createQuizAttempt(
  quizId: string,
  userId: string,
  score: number,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating quiz attempt", quizId, userId, score });
  return prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
    },
  });
}

export async function updateQuizAttemptScore(
  quizAttemptId: string,
  score: number,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating quiz attempt score", quizAttemptId, score });
  return prisma.quizAttempt.update({
    where: { uuid: quizAttemptId },
    data: {
      score,
    },
  });
}

export async function createQuestionResponse(
  attemptId: string,
  questionId: string,
  isCorrect: boolean,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating question response", attemptId, questionId, isCorrect });
  return prisma.questionResponse.create({
    data: { attemptId, questionId, isCorrect },
  });
}

export async function createAnswerSelection(
  responseId: string,
  answerId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating answer selection", responseId, answerId });
  return prisma.answerSelection.create({
    data: { responseId, answerId },
  });
}
