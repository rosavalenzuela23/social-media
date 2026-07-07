import PostController from "@posts/infrastructure/handlers/post.handler.js";
import createPostSchema from "@posts/infrastructure/schemas/post.schema.js";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";
import type { FastifyInstance } from "fastify";
import getPostsPageSchema from "./schemas/get-posts.schema.js";
import addCommentSchema from "./schemas/add-comment.schema.js";
import setLikeSchema from "./schemas/set-like.schema.js";
import likeCommentSchema from "./schemas/like-comment.schema.js";

const controller = PostController.instance;

async function routes(fastify: FastifyInstance) {
	const defaultRoute = "/api/posts";
	fastify.addHook("preHandler", requireAuth);
	fastify.get(defaultRoute + "/images/:uuid", controller.getImageByuuid.bind(controller));
	fastify.get(defaultRoute + "/users/:uuid", controller.getUserPosts.bind(controller));
	fastify.get(defaultRoute + "/me/", controller.getUserLoggedPosts.bind(controller));
	fastify.get(
		defaultRoute + "/feed",
		{ schema: getPostsPageSchema },
		controller.getFeed.bind(controller),
	);
	fastify.put(
		defaultRoute + "/:postId/like",
		{ schema: setLikeSchema },
		controller.setLike.bind(controller),
	);
	fastify.post(
		defaultRoute + "/:postId/comments",
		{ schema: addCommentSchema },
		controller.addCommentToPost.bind(controller),
	);
	fastify.post(
		defaultRoute + "/:postId/comments/:commentId/like",
		{ schema: likeCommentSchema },
		controller.likeComment.bind(controller),
	);
	fastify.get(defaultRoute + "/:postId", controller.getPostById.bind(controller));
	fastify.post(
		defaultRoute + "/",
		{ schema: createPostSchema },
		controller.createPost.bind(controller),
	);
}

export default routes;
