import type { FastifyInstance } from "fastify";
import createPostSchema from "@posts/infrastructure/schemas/post.schema.js";
import { createPost, getAllPosts, getUserLoggedPosts, getUserPosts, getImageByuuid } from "@posts/infrastructure/handlers/post.handler.js";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";

async function routes(fastify: FastifyInstance) {
    const defaultRoute = "/api/posts";
    fastify.get(defaultRoute + '/images/:uuid', getImageByuuid);
    fastify.addHook('preHandler', requireAuth);
    fastify.get(defaultRoute + '/users/:uuid', getUserPosts);
    fastify.get(defaultRoute + '/me/', getUserLoggedPosts);
    fastify.get(defaultRoute + '/', getAllPosts);
    fastify.post(defaultRoute + '/', { schema: createPostSchema }, createPost);
}

export default routes;