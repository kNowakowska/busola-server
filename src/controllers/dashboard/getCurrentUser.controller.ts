import { FastifyReply, FastifyRequest } from "fastify";

import { getUserWithCoursesByUserId } from "../../services/database/user.service";

export async function getCurrentUser(req: FastifyRequest, res: FastifyReply) {
  const { userId, email } = req.tokenPayload;
  const user = await getUserWithCoursesByUserId(userId);

  if (!user) {
    console.error(`User not found for userId: ${userId} and email: ${email}`);
    return res.status(404).send({ error: "Użytkownik nie odnaleziony" });
  }

  return res.status(200).send({
    ...user,
    courses: user.courses.map(({ course }) => ({
      ...course,
      lessonsCount: course.lessons.length,
      lessonsCompleted: course.lessons.filter(
        ({ users }) => users[0]?.isCompleted || false
      ).length,
    })),
  });
}
