import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  AnswerEntryEvent,
  ContentfulEntryEvent,
  CourseEntryEvent,
  LessonEntryEvent,
  QuestionEntryEvent,
  QuizEntryEvent,
} from "../../types/Contentful";
import { ContentfulContentType } from "../../types/Contentful";

import { upsertCourse } from "../../services/database/course.service";
import {
  getLessonByCmsId,
  upsertLesson,
  updateLessonToCourse,
} from "../../services/database/lesson.service";
import {
  getAnswerByCmsId,
  updateAnswerToQuestion,
  upsertAnswer,
} from "../../services/database/answer.service";
import {
  getQuestionByCmsId,
  updateQuestionToQuiz,
  upsertQuestion,
} from "../../services/database/question.service";
import {
  getQuizByCmsId,
  updateQuizToLesson,
  upsertQuiz,
} from "../../services/database/quiz.service";

export async function handleCMSWebhook(req: FastifyRequest, res: FastifyReply) {
  const payload = req.body as ContentfulEntryEvent<any>;
  req.log.info({ msg: "Entry", contentType: payload.sys.contentType.sys.id });

  switch (payload.sys.contentType.sys.id) {
    case ContentfulContentType.Course:
      {
        // create or update course in DB
        const course = (payload as CourseEntryEvent).fields;
        const createdCourse = await upsertCourse(
          payload.sys.id,
          {
            name: course.name["en-US"],
            shortDescription: course.shortDescription["en-US"],
            description: course.description["en-US"],
            imageCMSId: course.image["en-US"].sys.id,
            videoUrl: course.videoUrl["en-US"],
          },
          req.log,
        );

        // update lessons assigned to the course in DB
        const lessonsIds = course.lessons["en-US"].map((lesson) => lesson.sys.id);

        await Promise.all(
          lessonsIds.map(async (lessonId) => {
            const lesson = await getLessonByCmsId(lessonId, req.log);
            if (lesson) {
              await updateLessonToCourse(lesson.uuid, createdCourse.uuid, req.log);
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
          {
            name: lesson.name["en-US"],
            content: lesson.content["en-US"],
            order: lesson.order["en-US"],
            videoUrl: lesson.videoUrl["en-US"],
            tasksVideoUrl: lesson.videoUrlForTasks?.["en-US"],
            tasksFileCMSId: lesson.tasksFile?.["en-US"].sys.id,
          },
          req.log,
        );

        // update quizes assigned to the lesson in DB

        if (lesson?.quiz?.["en-US"]?.sys?.id) {
          const quiz = await getQuizByCmsId(lesson.quiz["en-US"].sys.id, req.log);
          if (quiz) {
            await updateQuizToLesson(quiz.uuid, createdLesson.uuid, req.log);
          }
        }
      }
      break;
    case ContentfulContentType.Quiz:
      {
        // create or update question in DB
        const quiz = (payload as QuizEntryEvent).fields;
        const createdQuiz = await upsertQuiz(
          payload.sys.id,
          quiz.name["en-US"],
          quiz.numberOfQuestions["en-US"],
          req.log,
        );

        const questionsIds = quiz.questions["en-US"].map((question) => question.sys.id);

        // update questions assigned to the quiz in DB
        await Promise.all(
          questionsIds.map(async (questionId) => {
            const question = await getQuestionByCmsId(questionId, req.log);
            if (question) {
              await updateQuestionToQuiz(createdQuiz.uuid, question.uuid, req.log);
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
          question.name["en-US"],
          question.type["en-US"],
          question.image["en-US"].sys.id,
          req.log,
        );

        const answersIds = question.options["en-US"].map((answer) => answer.sys.id);

        // update answers assigned to the question in DB
        await Promise.all(
          answersIds.map(async (answerId) => {
            const answer = await getAnswerByCmsId(answerId, req.log);
            if (answer) {
              await updateAnswerToQuestion(answer.uuid, createdQuestion.uuid, req.log);
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
          answer.name["en-US"],
          answer.isCorrect["en-US"],
          answer.image["en-US"].sys.id,
          req.log,
        );
      }
      break;
    // case ContentfulContentType.Post:
    //   {
    //     // create or update post in DB
    //     const post = (payload as PostEntryEvent).fields;
    //     await upsertPost(payload.sys.id, {
    //       name: post.name["en-US"],
    //       content: post.content["en-US"],
    //       imageCMSId: post.image["en-US"].sys.id,
    //       tags: post.tags["en-US"],
    //     });
    //   }
    //   break;
    default:
      req.log.error({
        msg: "Unsupported content type",
        contentType: payload.sys.contentType.sys.id,
      });
  }

  return res.send(true);
}
