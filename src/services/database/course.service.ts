import { prisma } from "../../config/prisma";

export async function upsertCourse(cmsId: string, name: string) {
  return prisma.course.upsert({
    where: { cmsId },
    update: { name },
    create: { name, cmsId },
  });
}
