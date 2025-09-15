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

export async function getPostsPaginated(page: number, size: number) {
  return prisma.blogPost.findMany({
    select: {
      name: true,
      createdAt: true,
      imageCMSId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: page * size,
    take: size,
  });
}

export async function getPostsTotal() {
  return prisma.blogPost.count();
}
