import type { FastifyReply, FastifyRequest } from "fastify";

import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import { getQuizWithRandomQuestions } from "../../services/database/quiz.service";

export async function getQuiz(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { quizId } = req.params as {
    courseId: string;
    lessonId: string;
    quizId: string;
  };

  if (!quizId) {
    req.log.error({ msg: "Invalid quizId", quizId, userId });
    return res.status(400).send({ error: "Nieprawidłowy identyfikator quizu" });
  }

  let quiz;
  try {
    quiz = await getQuizWithRandomQuestions(quizId, req.log);
    if (!quiz) {
      throw new NotFoundError(`Quiz with id: ${quizId} not found`);
    }
  } catch (error) {
    req.log.error({ msg: "Error getting quiz", userId, quizId, error });
    if (error instanceof NotFoundError) {
      return res.status(404).send({ error: "Quiz nie znaleziony" });
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).send({ error: "Użytkownik nie ma dostępu do tej lekcji quizu" });
    }
    return res.status(500).send({ error: "Coś poszło nie tak. Spróbuj ponownie później" });
  }

  return res.status(200).send({
    ...quiz,
    attempts: quiz.attempts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((attempt) => ({
        ...attempt,
        scoreInPercent: Math.round((attempt.score * 100) / quiz.questionsToDrawCount),
      })),
  });
}
