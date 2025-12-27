import { FastifyInstance } from "fastify";
import BusinessLogic from "../application/businessLogic";
import MongoRepository from "./mongo-repository";

const businessLogic = new BusinessLogic(
    new MongoRepository()
);

async function routes(fastify: FastifyInstance, options: any) {
    const defaultRoute = "/api/posts";

    fastify.get(defaultRoute + '/', async (req, res) => {
        if (!req.session.username) {
            res.status(401);
        }

        return businessLogic.getUserPosts(req.cookies.uuid);
    });

    fastify.post(defaultRoute + '/', async (req, res) => {

    });

}

export default routes;