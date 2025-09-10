import { omit } from "lodash";
import type { FastifyReply, FastifyRequest } from "fastify";

import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import { getCourseWithLessonsById } from "../../services/database/course.service";

export async function getCourse(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { courseId } = req.params as { courseId: string };

  if (!courseId) {
    console.error("Invalid courseId");
    return res.status(400).send({ error: "Nieprawidłowy identyfikator kursu" });
  }

  let course;
  try {
    course = await getCourseWithLessonsById(courseId, userId);
    if (!course) {
      throw new NotFoundError(`Course with id: ${courseId} not found`);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      return res.status(404).send({ error: "Kurs nie znaleziony" });
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).send({ error: "Użytkownik nie ma dostępu do tego kursu" });
    }
    return res.status(500).send({ error: "Coś poszło nie tak. Spróbuj ponownie później" });
  }

  const lessons = course.lessons.map((lesson) => ({
    ...omit(lesson, "users"),
    isCompleted: lesson.users[0]?.isCompleted || false,
  }));

  const lessonsCompleted = lessons.filter((lesson) => lesson.isCompleted).length;

  return res.status(200).send({
    ...course,
    lessons,
    lessonsCompleted,
    lessonsCount: course.lessons.length,
  });
}
