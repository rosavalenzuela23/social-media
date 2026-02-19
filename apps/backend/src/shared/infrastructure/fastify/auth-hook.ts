import type { FastifyReply, FastifyRequest } from "fastify";

export const requireAuth = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request?.session?.user) {
    request.log.info("Unauthorized request with ip: " +  request.ip);
    return reply.status(401).send({ message: "Unauthorized" });
  }
};
