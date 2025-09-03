import { FastifyRequest, FastifyReply } from "fastify";

import { getQuizById } from "../../services/database/quiz.service";
import {
  createAnswerSelection,
  createQuestionResponse,
  createQuizAttempt,
  updateQuizAttemptScore,
} from "../../services/database/quizAttempt.service";

export async function saveQuizAnswers(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { courseId, lessonId, quizId } = req.params as {
    courseId: string;
    lessonId: string;
    quizId: string;
  };
  const { questions } = req.body as {
    questions: { uuid: string; answer: string }[];
  };

  if (!courseId || !lessonId || !quizId) {
    return res
      .status(400)
      .send({ error: "Nieprawidłowy identyfikator kursu, lekcji lub quizu" });
  }

  if (!questions) {
    return res.status(400).send({ error: "Nieprawidłowy payload" });
  }

  const quiz = await getQuizById(quizId);
  if (!quiz) {
    return res.status(404).send({ error: "Quiz nie znaleziony" });
  }

  const quizAttempt = await createQuizAttempt(quizId, userId, 0);

  let score = 0;
  await Promise.all(
    questions.map(async (question) => {
      const roleQuestion = quiz.questions.find((q) => q.uuid === question.uuid);
      const correctAnswer = roleQuestion?.options?.find((o) => o.isCorrect);
      const isCorrect = correctAnswer
        ? correctAnswer.uuid === question.answer
        : false;

      score += isCorrect ? 1 : 0;

      const questionResponse = await createQuestionResponse(
        quizAttempt.uuid,
        question.uuid,
        isCorrect
      );
      return createAnswerSelection(questionResponse.uuid, question.answer);
    })
  );

  await updateQuizAttemptScore(quizAttempt.uuid, score);

  return res.status(200).send({
    scoreInPercent: Math.round((score * 100) / quiz.questionsToDrawCount),
    createdAt: quizAttempt.createdAt,
  });
}
