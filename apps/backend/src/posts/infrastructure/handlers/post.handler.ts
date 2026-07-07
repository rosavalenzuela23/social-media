import ProfileService from "@/profiles/application/profile.service.js";
import ProfileMongoRepository from "@/profiles/infraestructure/persistance/repositories/postgres.repository.js";
import PostService from "@posts/application/posts.service.js";
import MongoRepository from "@posts/infrastructure/persistance/repositories/mongo.repository.js";
import SharpManager from "@shared/utils/sharp.converter.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import UserExternalService from "../external-services/user.module.adapter.js";
import type { IdUserParams } from "./types/types.js";
import PostMapper from "../persistance/mappers/post.mapper.js";
import CommentMapper from "../persistance/mappers/comment.mapper.js";

class PostController {
	private static _instance: PostController | null = null;

	private postsService: PostService;

	private constructor() {
		this.postsService = new PostService(
			new MongoRepository(),
			UserExternalService.getInstance(
				new ProfileService(
					new ProfileMongoRepository(),
					new SharpManager(process.env.PROFILE_PICTURES_FOLDER),
				),
			),
			new SharpManager(process.env.UPLOAD_FOLDER),
		);
	}

	static get instance(): PostController {
		return this._instance || (this._instance = new this());
	}

	async getUserPosts(request: FastifyRequest<{ Params: IdUserParams }>, reply: FastifyReply) {
		if (!request.session.user) {
			reply.status(401);
			return { message: "Unauthorized" };
		}

		return this.postsService.getUserPosts(request.params.uuid);
	}

	async getUserLoggedPosts(request: FastifyRequest) {
		const userId = request.session.user!.uuid;
		const posts = await this.postsService.getUserPosts(userId);
		return posts.map((post) => PostMapper.toDto(post));
	}

	async getFeed(
		request: FastifyRequest<{
			Querystring: {
				page: number;
				size: number;
			};
		}>,
	) {
		const page = request.query.page;
		const size = request.query.size;
		return await this.postsService.getFeed(page, size, request.session.user!.uuid);
	}

	async getImageByuuid(request: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) {
		try {
			const stream = await this.postsService.getImageBufferById(request.params.uuid);

			reply.type("image/webp");
			return stream;
		} catch (err) {
			reply.status(404);
			request.log.error(err);
			return { message: "Image not found" };
		}
	}

	async addCommentToPost(
		request: FastifyRequest<{
			Body: {
				content: string;
			};
			Params: {
				postId: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const { content } = request.body;
		const { postId } = request.params;
		const userUuid = request.session.user!.uuid;

		await this.postsService.addCommentToPost(
			content,
			postId,
			userUuid,
			request.session.user!.username,
		);

		reply.code(201);
	}

	async getPostById(request: FastifyRequest<{ Params: { postId: string } }>) {
		const post = await this.postsService.getPostById(request.params.postId);
		return PostMapper.toDto(post);
	}

	async setLike(
		request: FastifyRequest<{
			Params: {
				postId: string;
			};
		}>,
	) {
		await this.postsService.setLike(request.params.postId, request.session.user!.uuid);
	}

	async likeComment(
		request: FastifyRequest<{
			Params: {
				postId: string;
				commentId: string;
			};
		}>,
		reply: FastifyReply,
	) {
		await this.postsService.likeComment(
			request.params.postId,
			request.params.commentId,
			request.session.user!.uuid,
			request.session.user!.username,
		);

		reply.code(201);
		return { message: "Comment liked!" };
	}

	async getPostComments(
		request: FastifyRequest<{
			Params: {
				postId: string;
			};
		}>,
	) {
		const comments = await this.postsService.getComments(request.params.postId);
		return comments.map((c) => CommentMapper.toDto(c));
	}

	async createPost(
		request: FastifyRequest<{
			Body: {
				content: { value: string };
				images?: any[] | any;
			};
		}>,
	) {
		let images = request.body.images;

		if (request.body.images && !Array.isArray(request.body.images)) {
			images = [request.body.images];
		}

		const buffers = [];

		if (images) {
			for (const image of images) {
				const buffer = await image.toBuffer();
				buffers.push(buffer);
			}
		}

		return await this.postsService.createPost(
			request.session.user!.uuid,
			request.session.user!.username,
			request.body.content.value,
			buffers,
		);
	}
}

export default PostController;
