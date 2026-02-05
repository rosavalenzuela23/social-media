import type { FastifyInstance } from "fastify";
import createPostSchema from "@posts/infrastructure/schemas/post.schema.js";
import PostController from "@posts/infrastructure/handlers/post.handler.js";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";
import getPostsPageSchema from "./schemas/get-posts.schema.js";

const controller = PostController.instance;

async function routes(fastify: FastifyInstance) {
  const defaultRoute = "/api/posts";
  fastify.addHook("preHandler", requireAuth);
  fastify.get(
    defaultRoute + "/images/:uuid",
    controller.getImageByuuid.bind(controller),
  );
  fastify.get(
    defaultRoute + "/users/:uuid",
    controller.getUserPosts.bind(controller),
  );
  fastify.get(
    defaultRoute + "/me/",
    controller.getUserLoggedPosts.bind(controller),
  );
  fastify.get(
    defaultRoute + "/",
    { schema: getPostsPageSchema },
    controller.getAllPosts.bind(controller),
  );
  fastify.post(
    defaultRoute + "/",
    { schema: createPostSchema },
    controller.createPost.bind(controller),
  );
}

export default routes;
