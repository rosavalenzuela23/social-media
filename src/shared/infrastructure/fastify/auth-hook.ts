import { FastifyReply, FastifyRequest } from "fastify"

export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.user) {
        reply.status(401).send({ message: "Unauthorized" });
        return;
    }
}