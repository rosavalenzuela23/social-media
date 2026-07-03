import type { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistsException, UserNotFoundException } from "@auth/application/exceptions.js";
import UserService from "@auth/application/user.service.js";
import MongoRepository from "@auth/infraestructure/persistance/repositories/mongo.repository.js";

class UserController {
  private static _instance: UserController;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private userService: UserService;

  private constructor() {
    this.userService = new UserService(new MongoRepository());
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { username: string; password: string };

    try {
      const user = await this.userService.login(body.username, body.password);

      const sessionData = {
        username: user.username,
        uuid: user.uuid,
      };

      request.session.user = sessionData;

      return {
        message: "Login successful",
        sessionData,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        reply.status(400);
        return {
          message: "Usuario no encontrado",
        };
      }

      throw error;
    }
  }

  async logout(request: FastifyRequest) {
    request.session.destroy();
    return { message: "Session destroyed" };
  }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { username: string; password: string };

    try {
      const message = await this.userService.createUser(body.username, body.password);
      return {
        message,
      };
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

  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}

export default UserController;
