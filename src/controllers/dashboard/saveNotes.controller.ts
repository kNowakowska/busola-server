import { omit } from "lodash";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Lesson } from "../../generated/prisma";
import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import { UserTokenPayload } from "../../types/UserTokenPayload";
import {
  getLessonById,
  saveNotesTolesson,
} from "../../services/database/lesson.service";

export async function saveNotes(
  req: FastifyRequest,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  const { courseId, lessonId } = req.params as {
    courseId: string;
    lessonId: string;
  };
  const { notes } = req.body as { notes: string };

  if (!courseId || !lessonId) {
    console.error("Invalid courseId or lessonId");
    return res.status(400).send({ error: "Invalid courseId or lessonId" });
  }

  const token = req.cookies?.access_token;
  let decoded: UserTokenPayload;

  if (!token) {
    console.error("No token found");
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    decoded = fastify.jwt.verify<UserTokenPayload>(token);
  } catch (error) {
    console.error(error);
    return res.status(401).send({ error: "Unauthorized" });
  }

  let lesson, userToLesson;

  try {
    lesson = await getLessonById(lessonId, courseId, decoded.userId);
    if (!lesson) {
      throw new NotFoundError(`Lesson with id: ${lessonId} not found`);
    }
    userToLesson = await saveNotesTolesson(
      lesson as unknown as Lesson,
      decoded.userId,
      notes
    );
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
    ...omit(userToLesson, "lesson"),
    ...userToLesson.lesson,
  });
}
