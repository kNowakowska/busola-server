import { prisma } from "../../config/prisma";

export async function createQuizAttempt(
  quizId: string,
  userId: string,
  score: number
) {
  console.log("Creating quiz attempt:", { quizId, userId, score });
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
  score: number
) {
  console.log("Updating quiz attempt score:", { quizAttemptId, score });
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
  isCorrect: boolean
) {
  console.log("Creating question response:", {
    attemptId,
    questionId,
    isCorrect,
  });
  return prisma.questionResponse.create({
    data: { attemptId, questionId, isCorrect },
  });
}

export async function createAnswerSelection(
  responseId: string,
  answerId: string
) {
  console.log("Creating answer selection:", { responseId, answerId });
  return prisma.answerSelection.create({
    data: { responseId, answerId },
  });
}
