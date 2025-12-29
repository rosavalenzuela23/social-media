import { FastifyInstance } from "fastify";
import createUserSchema from "./schemas/create-user.schema";
import { login, logout, getAllUsers, createUser } from "./handlers/user.handler";



async function routes(fastify: FastifyInstance) {
    const defaultRoute = "/api/users";
    fastify.post(defaultRoute + '/login/', login);
    fastify.get(defaultRoute + '/logout/', logout);
    fastify.get(defaultRoute + '/', getAllUsers);
    fastify.post(defaultRoute + '/', { schema: createUserSchema }, createUser);
}

export default routes;