import type { FastifyReply, FastifyRequest } from "fastify";

export function handlerWrapper(
  callback: (req: FastifyRequest<any>, res: FastifyReply, ...args: any[]) => Promise<any>,
) {
  return async (req: FastifyRequest, res: FastifyReply, ...args: any[]) => {
    try {
      return await callback(req, res, ...args);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Coś poszło nie tak. Spróbuj ponownie później" });
    }
  };
}
