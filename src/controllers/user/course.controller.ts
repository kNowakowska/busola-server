import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";

import { UserTokenPayload } from "../../types/UserTokenPayload";
import { getCourseWithLessonsById } from "../../services/database/course.service";

export async function course(
  req: FastifyRequest,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  const { courseId } = req.params as { courseId: string };

  if (!courseId) {
    console.error("Invalid courseId");
    return res.status(400).send({ error: "Invalid courseId" });
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

  let course;
  try {
    course = await getCourseWithLessonsById(courseId, decoded.userId);
    if (!course) {
      throw new NotFoundError(`Course with id: ${courseId} not found`);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof NotFoundError) {
      return res.status(404).send({ error: "Course not found" });
    }
    if (error instanceof ForbiddenError) {
      return res
        .status(403)
        .send({ error: "User doesn't have access to this course" });
    }
    return res.status(500).send({ error: "Internal server error" });
  }

  return res.status(200).send(course);
}
