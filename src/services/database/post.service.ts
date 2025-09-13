import { prisma } from "../../config/prisma";

export async function upsertPost(
  cmsId: string,
  data: { name: string; content: string; imageCMSId: string; tags: string[] },
) {
  return prisma.blogPost.upsert({
    where: { cmsId },
    update: { ...data },
    create: { ...data, cmsId },
  });
}
