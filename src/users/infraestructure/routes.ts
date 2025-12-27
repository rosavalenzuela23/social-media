import { FastifyInstance, FastifyRequest } from "fastify";
import BusinessLogic from "../application/businessLogic";
import MongoRepository from "./mongo-repository";
import createUserSchema from "./schemas/create-user.schema";
import { UserAlreadyExistsException, UserNotFoundException } from "../application/exceptions";

const businessLogic = new BusinessLogic(
    new MongoRepository()
);

async function routes(fastify: FastifyInstance) {
    const defaultRoute = "/api/users";

    fastify.post(defaultRoute + '/login/', async (req, res) => {
        const body = req.body as { username: string, password: string };

        try {
            const user = await businessLogic.login(body.username, body.password);

            req.session.username = user.username;
            req.session.uuid = user.uuid;

            return user;
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                res.status(400);
                return {
                    message: "Usuario no encontrado"
                };
            }

            throw error;
        }

    });

    fastify.get(defaultRoute + '/logout/', async (req, res) => {
        req.session.destroy();
        return { message: "Session destroyed" };
    });

    fastify.get(defaultRoute + '/', async () => {
        return businessLogic.getAllUsers();
    });

    fastify.post(defaultRoute + '/', {
        schema: createUserSchema
    }, async (req, res) => {
        const body = req.body as { username: string, password: string };

        try {
            return await businessLogic.createUser(body.username, body.password);
        } catch (error) {
            if (error instanceof UserAlreadyExistsException) {
                res.status(400);
                return {
                    message: error.message
                }
            }

            throw error;
        }
    });

}

export default routes;