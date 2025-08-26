import { FastifyReply, FastifyRequest } from "fastify";

import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import {
  getLessonById,
  getNextLessonId,
  getPreviousLessonId,
} from "../../services/database/lesson.service";

export async function getLesson(req: FastifyRequest, res: FastifyReply) {
  const { userId } = req.tokenPayload;
  const { courseId, lessonId } = req.params as {
    courseId: string;
    lessonId: string;
  };

  if (!courseId || !lessonId) {
    console.error("Invalid courseId or lessonId");
    return res.status(400).send({ error: "Invalid courseId or lessonId" });
  }

  let lesson, previousLessonId, nextLessonId;
  try {
    lesson = await getLessonById(lessonId, courseId, userId);
    if (!lesson) {
      throw new NotFoundError(`Lesson with id: ${lessonId} not found`);
    }
    previousLessonId = await getPreviousLessonId(lesson);
    nextLessonId = await getNextLessonId(lesson);
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      return res.status(404).send({ error: "Lesson not found" });
    }
    if (error instanceof ForbiddenError) {
      return res
        .status(403)
        .send({ error: "User doesn't have access to this lesson" });
    }
    return res.status(500).send({ error: "Internal server error" });
  }

  return res.status(200).send({
    ...lesson,
    previousLessonId,
    nextLessonId,
    isCompleted: lesson.users[0]?.isCompleted || false,
    notes: lesson.users[0]?.notes || "",
  });
}
