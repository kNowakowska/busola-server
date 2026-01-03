import type { FastifyReply, FastifyRequest } from "fastify";
import omit from "lodash/omit";

import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import { getLessonById, markLessonAsCompleted } from "../../services/database/lesson.service";
import type { Lesson } from "../../generated/prisma";

export async function completeLesson(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { courseId, lessonId } = req.params as {
    courseId: string;
    lessonId: string;
  };

  if (!courseId || !lessonId) {
    req.log.error({ msg: "Invalid courseId or lessonId", courseId, lessonId, userId });
    return res.status(400).send({ error: "Nieprawidłowy identyfikator kursu lub lekcji" });
  }

  let lesson, userToLesson;

  try {
    lesson = await getLessonById(lessonId, courseId, userId, req.log);
    if (!lesson) {
      throw new NotFoundError(`Lesson with id: ${lessonId} not found`);
    }
    userToLesson = await markLessonAsCompleted(lesson as unknown as Lesson, userId, req.log);
  } catch (error) {
    req.log.error({ msg: "Error completing lesson", userId, courseId, lessonId, error });
    if (error instanceof NotFoundError) {
      return res.status(404).send({ error: "Lekcja nie znaleziona" });
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).send({ error: "Użytkownik nie ma dostępu do tej lekcji" });
    }
    return res.status(500).send({ error: "Coś poszło nie tak. Spróbuj ponownie później" });
  }

  return res.status(200).send({
    ...omit(userToLesson, "lesson"),
    ...userToLesson.lesson,
  });
}
