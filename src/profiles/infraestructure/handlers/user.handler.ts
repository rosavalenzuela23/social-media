import type { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistsException } from "@profiles/application/exceptions.js";
import UserService from "@profiles/application/user.service.js";
import MongoRepository from "@profiles/infraestructure/persistance/repositories/mongo.repository.js";

const userService = new UserService(new MongoRepository());

async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { username: string; password: string };

  try {
    return await userService.createUser(body.username, body.password);
  } catch (error) {
    if (error instanceof UserAlreadyExistsException) {
      reply.status(400);
      return {
        message: error.message,
      };
    }

    throw error;
  }
}

async function getAllUsers() {
  return await userService.getAllProfiles();
}

export { getAllUsers, createUser };
