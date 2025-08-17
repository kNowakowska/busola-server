import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getUserWithCoursesByUserId } from "../../services/database/user.service";
import { UserTokenPayload } from "../../types/UserTokenPayload";

export async function getCurrentUser(
  req: FastifyRequest,
  res: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      console.error("No token found");
      return res.status(401).send({ error: "Unauthorized" });
    }

    const decoded = fastify.jwt.verify<UserTokenPayload>(token);
    const user = await getUserWithCoursesByUserId(decoded.userId);

    if (!user) {
      console.error(
        `User not found for userId: ${decoded.userId} and email: ${decoded.email}`
      );
      return res.status(401).send({ error: "Unauthorized" });
    }

    return res.status(200).send({
      ...user,
      courses: user.courses.map((course) => ({
        ...course.course,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send({ error: "Unauthorized" });
  }
}
