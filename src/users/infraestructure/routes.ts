import type { FastifyInstance } from "fastify";
import createUserSchema from "@users/infraestructure/schemas/create-user.schema.js";
import { login, logout, getAllUsers, createUser } from "@users/infraestructure/handlers/user.handler.js";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";



async function routes(fastify: FastifyInstance) {
    const defaultRoute = "/api/users";
    fastify.post(defaultRoute + '/login/', login);
    fastify.get(defaultRoute + '/logout/', { preHandler: [requireAuth] }, logout);
    fastify.get(defaultRoute + '/', { preHandler: [requireAuth] }, getAllUsers);
    fastify.post(defaultRoute + '/', { schema: createUserSchema }, createUser);
}

export default routes;