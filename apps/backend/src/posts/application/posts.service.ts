import type { FileManager } from "@posts/application/ports/file.manager.js";
import type { IPostRepository } from "@posts/application/ports/post.repository.js";
import Post, { PostBuilder } from "@posts/domain/post.js";
import { ReadStream } from "fs";
import { v4 as uuidv4 } from "uuid";
import Image from "../domain/image.js";
import type { IUserModulePort } from "./ports/users.module.port.js";
import { CommentBuilder } from "../domain/comment.js";
import Like from "../domain/like.js";

export default class PostService {
	constructor(
		private postRepository: IPostRepository,
		private userModulePort: IUserModulePort,
		private fileManager: FileManager,
	) {}

	async getFeed(page: number, size: number, userUuid: string) {
		let blockedUsersUuid: string[] = [];

		try {
			blockedUsersUuid = await this.userModulePort.getBlockedUsersUuid(userUuid);
		} catch (error) {
			console.error(error);
		}

		return await this.postRepository.getAllPosts(userUuid, page, size, blockedUsersUuid);
	}

	async getUserPosts(creatorUuid: string) {
		return await this.postRepository.getUserPosts(creatorUuid);
	}

	async createPost(userUuid: string, username: string, message: string, imagesBuffer?: Buffer[]) {
		//Obtener toda la informacion del usuario
		const images: Image[] = [];
		try {
			for (const buffer of imagesBuffer) {
				const uuid = uuidv4();
				await this.fileManager.saveImage(buffer, uuid);
				const image = new Image(uuid + ".webp", uuid);
				images.push(image);
			}

			const post = new PostBuilder()
				.setCreator(userUuid, username)
				.setMessage(message)
				.setDate(new Date())
				.setExcludeList([])
				.addImages(images)
				.build();

			return await this.postRepository.createPost(post);
		} catch (error) {
			console.log(error);
			for (const image of images) {
				await this.fileManager.deleteFile(image.uuid);
			}
			throw error;
		}
	}

	async addCommentToPost(content: string, postId: string, userId: string, username: string) {
		const post = await this.postRepository.getPostById(postId);

		if (!post.comments) {
			post.comments = [];
		}

		const comment = new CommentBuilder()
			.setCreator(userId, username)
      .setUuid(crypto.randomUUID())
      .setMessage(content)
			.setDate(new Date())
			.setPostUuid(postId)
			.build();

		post.comments.push(comment);
		await this.postRepository.updatePost(post);
	}

	async getPostById(id: string): Promise<Post> {
		return await this.postRepository.getPostById(id);
	}

	async getImageBufferById(uuid: string): Promise<ReadStream> {
		const image = await this.postRepository.getImageByUuid(uuid);
		return this.fileManager.getReadStreamFromFileName(image.uuid);
	}

	async likeComment(postId: string, commentId: string, userId: string, username: string) {
		const post = await this.postRepository.getPostById(postId);
		const comment = post.comments?.find((comment) => comment.uuid === commentId);

		if (!comment) {
			throw new Error("Comment not found!");
		}

		if (!comment.likes) {
			comment.likes = [];
		}

		const like = comment.likes.find((like) => like.userUuid === userId);

		if (like) {
			comment.likes = comment.likes.filter((like) => like.userUuid !== userId);
		} else {
			const like = new Like();
			like.userUuid = userId;
			like.postId = commentId;
			like.postId = postId; // change to parentId
			like.username = username;
			like.createdAt = new Date();
			comment.likes.push(like);
		}

		await this.postRepository.updatePost(post);
	}

	async setLike(postId: string, userId: string) {
		const post = await this.postRepository.getPostById(postId);

		if (!post.likes) {
			post.likes = [];
		}

		//remove the like
		for (const like of post.likes) {
			if (like.userUuid === userId) {
				post.likes = post.likes.filter((l) => l.userUuid !== userId);
				await this.postRepository.updatePost(post);
				return;
			}
		}

		// add the like
		const like = new Like();
		like.userUuid = userId;
		like.postId = postId;
		like.username = "no-username";
		like.createdAt = new Date();

		post.likes.push(like);
		await this.postRepository.updatePost(post);
	}
}
