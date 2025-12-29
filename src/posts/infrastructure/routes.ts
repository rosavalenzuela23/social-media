import { FastifyInstance } from "fastify";
import createPostSchema from "./schemas/post.schema";
import { createPost, getAllPosts, getUserLoggedPosts, getUserPosts } from "./handlers/post.handler";



async function routes(fastify: FastifyInstance, options: any) {
    const defaultRoute = "/api/posts";
    fastify.get(defaultRoute + '/users/:uuid', getUserPosts);
    fastify.get(defaultRoute + '/me/', getUserLoggedPosts);
    fastify.get(defaultRoute + '/', getAllPosts);
    fastify.post(defaultRoute + '/', { schema: createPostSchema }, createPost);
}

export default routes;