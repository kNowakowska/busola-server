import type { FastifyInstance } from "fastify";
import type {
  AnswerEntryEvent,
  ContentfulEntryEvent,
  CourseEntryEvent,
  LessonEntryEvent,
  QuestionEntryEvent,
  QuizEntryEvent} from "../types/Contentful";
import {
  ContentfulContentType
} from "../types/Contentful";

import { upsertCourse } from "../services/database/course.service";
import {
  getLessonByCmsId,
  upsertLesson,
  updateLessonToCourse,
} from "../services/database/lesson.service";
import {
  getAnswerByCmsId,
  updateAnswerToQuestion,
  upsertAnswer,
} from "../services/database/answer.service";
import {
  getQuestionByCmsId,
  updateQuestionToQuiz,
  upsertQuestion,
} from "../services/database/question.service";
import { getQuizByCmsId, updateQuizToLesson, upsertQuiz } from "../services/database/quiz.service";

export async function webhookRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/webhook",
    {
      schema: {
        tags: ["Webhook"],
        summary: "Contentful webhook endpoint",
        body: { $ref: "ContentfulEntryEvent#" },
        response: {
          200: { type: "boolean" },
          400: { $ref: "ErrorResponse#" },
        },
      },
    },
    async (req, res) => {
      try {
        const payload = req.body as ContentfulEntryEvent<any>;
        console.log("Entry:", payload.sys.contentType.sys.id);

        switch (payload.sys.contentType.sys.id) {
          case ContentfulContentType.Course:
            {
              // create or update course in DB
              const course = (payload as CourseEntryEvent).fields;
              const createdCourse = await upsertCourse(payload.sys.id, {
                name: course.name["en-US"],
                shortDescription: course.shortDescription["en-US"],
                description: course.description["en-US"],
                imageCMSId: course.image["en-US"].sys.id,
              });

              // update lessons assigned to the course in DB
              const lessonsIds = course.lessons["en-US"].map((lesson) => lesson.sys.id);

              await Promise.all(
                lessonsIds.map(async (lessonId) => {
                  const lesson = await getLessonByCmsId(lessonId);
                  if (lesson) {
                    await updateLessonToCourse(lesson.uuid, createdCourse.uuid);
                  }
                }),
              );
            }
            break;
          case ContentfulContentType.Lesson:
            {
              // create or update lesson in DB
              const lesson = (payload as LessonEntryEvent).fields;
              const createdLesson = await upsertLesson(
                payload.sys.id,
                lesson.name["en-US"],
                lesson.content["en-US"],
                lesson.order["en-US"],
                lesson.videoUrl["en-US"],
              );

              // update quizes assigned to the lesson in DB

              if (lesson?.quiz?.["en-US"]?.sys?.id) {
                const quiz = await getQuizByCmsId(lesson.quiz["en-US"].sys.id);
                if (quiz) {
                  await updateQuizToLesson(quiz.uuid, createdLesson.uuid);
                }
              }
            }
            break;
          case ContentfulContentType.Quiz:
            {
              // create or update question in DB
              const quiz = (payload as QuizEntryEvent).fields;
              const createdQuiz = await upsertQuiz(payload.sys.id, quiz.name["en-US"]);

              const questionsIds = quiz.questions["en-US"].map((question) => question.sys.id);

              // update questions assigned to the quiz in DB
              await Promise.all(
                questionsIds.map(async (questionId) => {
                  const question = await getQuestionByCmsId(questionId);
                  if (question) {
                    await updateQuestionToQuiz(createdQuiz.uuid, question.uuid);
                  }
                }),
              );
            }
            break;

          case ContentfulContentType.Question:
            {
              // create or update question in DB
              const question = (payload as QuestionEntryEvent).fields;
              const createdQuestion = await upsertQuestion(
                payload.sys.id,
                question.questionText["en-US"],
                question.questionType["en-US"],
              );

              const answersIds = question.options["en-US"].map((answer) => answer.sys.id);

              // update answers assigned to the question in DB
              await Promise.all(
                answersIds.map(async (answerId) => {
                  const answer = await getAnswerByCmsId(answerId);
                  if (answer) {
                    await updateAnswerToQuestion(answer.uuid, createdQuestion.uuid);
                  }
                }),
              );
            }
            break;
          case ContentfulContentType.Answer:
            {
              // create or update answer in DB
              const answer = (payload as AnswerEntryEvent).fields;
              await upsertAnswer(
                payload.sys.id,
                answer.answerText["en-US"],
                answer.isCorrect["en-US"],
              );
            }
            break;
          default:
            console.log("Unsupported content type", payload.sys.contentType.sys.id);
        }

        return res.send(true);
      } catch (err) {
        console.error(err);
        return res.status(400).send(err);
      }
    },
  );
}
