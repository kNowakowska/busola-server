import type { FastifyBaseLogger } from "fastify";

import { prisma } from "../../config/prisma";
import { QuestionType as ContentfulQuestionType } from "../../types/Contentful";
import { QuestionType } from "../../generated/prisma";

function mapQuestionType(type: ContentfulQuestionType) {
  switch (type) {
    case ContentfulQuestionType.SingleChoice:
      return QuestionType.SINGLE;
    case ContentfulQuestionType.MultipleChoice:
      return QuestionType.MULTIPLE;
    case ContentfulQuestionType.OpenAnswer:
      return QuestionType.OPEN;
  }
}

export async function createQuestion(
  question: string,
  type: QuestionType,
  cmsId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating question", question, type, cmsId });
  return prisma.question.create({
    data: { text: question, type, cmsId },
  });
}

export async function getQuestionByCmsId(cmsId: string, logger: FastifyBaseLogger) {
  logger.info({ msg: "Fetching question by cms id", cmsId });
  return prisma.question.findUnique({
    where: { cmsId },
  });
}

export async function updateQuestion(
  questionId: string,
  question: string,
  type: QuestionType,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating question", questionId, question, type });
  return prisma.question.update({
    where: { uuid: questionId },
    data: { text: question, type },
  });
}

export async function createOrUpdateQuestion(
  questionPayload: {
    text: string;
    type: ContentfulQuestionType;
    cmsId: string;
  },
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Creating or updating question", questionPayload });
  const question = await getQuestionByCmsId(questionPayload.cmsId, logger);
  if (question) {
    return updateQuestion(
      question.uuid,
      questionPayload.text,
      mapQuestionType(questionPayload.type),
      logger,
    );
  }
  return createQuestion(
    questionPayload.text,
    mapQuestionType(questionPayload.type),
    questionPayload.cmsId,
    logger,
  );
}

export async function upsertQuestion(
  cmsId: string,
  question: string,
  type: ContentfulQuestionType,
  imageCMSId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Upserting question", cmsId, question, type, imageCMSId });
  return prisma.question.upsert({
    where: { cmsId },
    update: { text: question, type: mapQuestionType(type), imageCMSId },
    create: { text: question, type: mapQuestionType(type), cmsId, imageCMSId },
  });
}

export async function updateQuestionToQuiz(
  quizId: string,
  questionId: string,
  logger: FastifyBaseLogger,
) {
  logger.info({ msg: "Updating question to quiz", quizId, questionId });
  return prisma.question.update({
    where: { uuid: questionId },
    data: { quizId },
  });
}
