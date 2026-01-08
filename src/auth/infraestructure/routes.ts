import type { FastifyInstance } from "fastify";
import createUserSchema from "@auth/infraestructure/schemas/create-user.schema.js";
import UserController from "@auth/infraestructure/handlers/user.handler.js";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";
import loginUserSchema from "@auth/infraestructure/schemas/login.schema.js";

const userController = UserController.instance;


async function routes(fastify: FastifyInstance) {
    const defaultRoute = "/api/users";
    fastify.post(defaultRoute + '/login/', { schema: loginUserSchema }, userController.login.bind(userController));
    fastify.get(defaultRoute + '/logout/', { preHandler: [requireAuth] }, userController.logout.bind(userController));
    fastify.get(defaultRoute + '/', { preHandler: [requireAuth] }, userController.getAllUsers.bind(userController));
    fastify.post(defaultRoute + '/', { schema: createUserSchema }, userController.createUser.bind(userController));
}

export default routes;