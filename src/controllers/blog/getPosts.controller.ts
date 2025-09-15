import type { FastifyReply, FastifyRequest } from "fastify";

import { getPostsPaginated, getPostsTotal } from "../../services/database/post.service";

export async function getPosts(req: FastifyRequest, res: FastifyReply) {
  const { page, size } = req.query as {
    page: number;
    size: number;
  };

  const [posts, total] = await Promise.all([getPostsPaginated(page, size), getPostsTotal()]);

  res.status(200).send({
    data: posts,
    page,
    size,
    total,
  });
}
