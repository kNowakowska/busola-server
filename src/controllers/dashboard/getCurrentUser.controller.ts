import type { FastifyReply, FastifyRequest } from "fastify";

import { getUserWithCoursesByUserId } from "../../services/database/user.service";

export async function getCurrentUser(req: FastifyRequest, res: FastifyReply) {
  const { userId, email } = req.tokenPayload;
  const user = await getUserWithCoursesByUserId(userId, req.log);

  if (!user) {
    req.log.error({ msg: "User not found for userId and email", userId, email });
    return res.status(404).send({ error: "Użytkownik nie odnaleziony" });
  }

  return res.status(200).send({
    ...user,
    courses: user.courses.map(({ course }) => ({
      ...course,
      lessonsCount: course.lessons.length,
      lessonsCompleted: course.lessons.filter(({ users }) => users[0]?.isCompleted || false).length,
    })),
  });
}
