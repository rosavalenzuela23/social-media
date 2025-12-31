import { FastifyInstance } from "fastify";
import createUserSchema from "./schemas/create-user.schema";
import { login, logout, getAllUsers, createUser } from "./handlers/user.handler";
import { requireAuth } from "../../shared/infrastructure/fastify/auth-hook";



async function routes(fastify: FastifyInstance) {
    const defaultRoute = "/api/users";
    fastify.post(defaultRoute + '/login/', login);
    fastify.get(defaultRoute + '/logout/', { preHandler: [requireAuth] }, logout);
    fastify.get(defaultRoute + '/', { preHandler: [requireAuth] }, getAllUsers);
    fastify.post(defaultRoute + '/', { schema: createUserSchema }, createUser);
}

export default routes;