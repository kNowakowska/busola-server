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
  cmsId: string
) {
  console.log("Creating question:", question);
  return prisma.question.create({
    data: { text: question, type, cmsId },
  });
}

export async function getQuestionByCmsId(cmsId: string) {
  return prisma.question.findUnique({
    where: { cmsId },
  });
}

export async function updateQuestion(
  questionId: string,
  question: string,
  type: QuestionType
) {
  return prisma.question.update({
    where: { uuid: questionId },
    data: { text: question, type },
  });
}

export async function createOrUpdateQuestion(questionPayload: {
  text: string;
  type: ContentfulQuestionType;
  cmsId: string;
}) {
  const question = await getQuestionByCmsId(questionPayload.cmsId);
  if (question) {
    return updateQuestion(
      question.uuid,
      questionPayload.text,
      mapQuestionType(questionPayload.type)
    );
  }
  return createQuestion(
    questionPayload.text,
    mapQuestionType(questionPayload.type),
    questionPayload.cmsId
  );
}

export async function upsertQuestion(
  cmsId: string,
  question: string,
  type: ContentfulQuestionType
) {
  return prisma.question.upsert({
    where: { cmsId },
    update: { text: question, type: mapQuestionType(type) },
    create: { text: question, type: mapQuestionType(type), cmsId },
  });
}

export async function updateQuestionToQuiz(quizId: string, questionId: string) {
  return prisma.question.update({
    where: { uuid: questionId },
    data: { quizId },
  });
}
