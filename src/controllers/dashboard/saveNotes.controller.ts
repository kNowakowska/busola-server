import { omit } from "lodash";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { Lesson } from "../../generated/prisma";
import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import { getLessonById, saveNotesTolesson } from "../../services/database/lesson.service";

export async function saveNotes(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { courseId, lessonId } = req.params as {
    courseId: string;
    lessonId: string;
  };
  const { notes } = req.body as { notes: string };

  if (!courseId || !lessonId) {
    console.error("Invalid courseId or lessonId");
    return res.status(400).send({ error: "Nieprawidłowy identyfikator kursu lub lekcji" });
  }

  let lesson, userToLesson;

  try {
    lesson = await getLessonById(lessonId, courseId, userId);
    if (!lesson) {
      throw new NotFoundError(`Lesson with id: ${lessonId} not found`);
    }
    userToLesson = await saveNotesTolesson(lesson as unknown as Lesson, userId, notes);
  } catch (error) {
    console.error(error);
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
