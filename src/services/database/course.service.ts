import { prisma } from "../../config/prisma";

export async function upsertCourse(
  cmsId: string,
  data: {
    name: string;
    shortDescription: string;
    description: string;
    imageCMSId: string;
  }
) {
  return prisma.course.upsert({
    where: { cmsId },
    update: {
      ...data,
    },
    create: { ...data, cmsId },
  });
}
