import { prisma } from "../../config/prisma";
import { NotFoundError } from "../../errors/NotFoundError";
import getRandomElementsFromArray from "../../utils/getRandomElementsFromArray";

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

export async function getQuizById(uuid: string) {
  console.log("Fetching quiz by id:", uuid);
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

export async function upsertQuiz(cmsId: string, name: string, questionsToDrawCount: number) {
  return prisma.quiz.upsert({
    where: { cmsId },
    update: { name, questionsToDrawCount },
    create: { name, cmsId, questionsToDrawCount },
  });
}

export async function getQuizWithRandomQuestions(quizId: string) {
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
