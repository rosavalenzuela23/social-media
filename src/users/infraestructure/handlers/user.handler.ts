import { FastifyRequest } from "fastify";
import { UserAlreadyExistsException, UserNotFoundException } from "../../application/exceptions";
import UserService from "../../application/user.service";
import MongoRepository from "../persistance/repositories/mongo.repository";
import { FastifyReply } from "fastify";

const userService = new UserService(
    new MongoRepository()
);

async function login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { username: string, password: string };

    try {
        const user = await userService.login(body.username, body.password);

        request.session.user = {
            username: user.username,
            uuid: user.uuid
        };

        return {
            message: "Login successful"
        };
    } catch (error) {
        if (error instanceof UserNotFoundException) {
            reply.status(400);
            return {
                message: "Usuario no encontrado"
            };
        }

        throw error;
    }
}

async function logout(request: FastifyRequest) {
    request.session.destroy();
    return { message: "Session destroyed" };
}

async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { username: string, password: string };

    try {
        return await userService.createUser(body.username, body.password);
    } catch (error) {
        if (error instanceof UserAlreadyExistsException) {
            reply.status(400);
            return {
                message: error.message
            }
        }

        throw error;
    }
}

async function getAllUsers() {
    return await userService.getAllUsers();
}

export {
    login,
    logout,
    getAllUsers,
    createUser
}