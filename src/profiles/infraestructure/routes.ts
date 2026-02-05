import type { FastifyInstance } from "fastify";
import createUserSchema from "@profiles/infraestructure/schemas/create-user.schema.js";
import {
  getAllUsers,
  createUser,
} from "@profiles/infraestructure/handlers/user.handler.js";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";

async function routes(fastify: FastifyInstance) {
  const defaultRoute = "/api/profiles";
  fastify.get(defaultRoute + "/", { preHandler: [requireAuth] }, getAllUsers);
  fastify.post(defaultRoute + "/", { schema: createUserSchema }, createUser);
}

export default routes;
