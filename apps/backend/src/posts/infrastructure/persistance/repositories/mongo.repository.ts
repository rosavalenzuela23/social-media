import type Image from "@/posts/domain/image.js";
import type { IPostRepository } from "@posts/application/ports/post.repository.js";
import Post from "@posts/domain/post.js";
import PostEntity from "@posts/infrastructure/persistance/entities/post.entity.js";
import PostMapper from "@posts/infrastructure/persistance/mappers/post.mapper.js";
import { appDataSource as datasource } from "@shared/infrastructure/persistance/mongo-connection.js";
import ImageMapper from "../mappers/image.mapper.js";

export default class MongoRepository implements IPostRepository {
	private dbContainer = datasource;

	async getAllPosts(
		userUuid: string,
		page: number,
		size: number,
		userUuidExcludeList?: string[],
	): Promise<Post[]> {
		const blockedUsers = userUuidExcludeList ?? [];

		const posts = await this.dbContainer.getRepository(PostEntity).find({
			skip: page * size,
			take: size,
			order: {
				createdAt: "DESC",
			},
			where: {
				userUuidExcludeList: {
					$nin: [userUuid],
				},
				creatorUuid: {
					$nin: blockedUsers,
				},
			} as any,
		});
		return posts.map((post) => PostMapper.toDomain(post));
	}

	async getFeed(
		userUuid: string,
		page: number,
		size: number,
		userUuidExcludeList?: string[],
		categories?: string[],
	): Promise<Post[]> {
		if (!categories?.length) {
			return [];
		}

		const blockedUsers = userUuidExcludeList ?? [];

		const posts = await this.dbContainer.getRepository(PostEntity).find({
			skip: page * size,
			take: size,
			order: {
				createdAt: "DESC",
			},
			where: {
				userUuidExcludeList: {
					$nin: [userUuid],
				},
				creatorUuid: {
					$nin: blockedUsers,
				},
				categories: {
					$in: categories,
				},
			} as any,
		});
		return posts.map((post) => PostMapper.toDomain(post));
	}

	async getUserPosts(userUuid: string): Promise<Post[]> {
		const posts = await this.dbContainer.getRepository(PostEntity).find({
			where: {
				creatorUuid: userUuid,
			},
			relations: {
				comments: true,
			},
		});

		console.log(posts);

		return posts.map((post) => PostMapper.toDomain(post));
	}

	async createPost(post: Post): Promise<void> {
		const postEntity = PostMapper.toEntity(post);
		await this.dbContainer.getRepository(PostEntity).save(postEntity);
	}

	async getImageByUuid(uuid: string): Promise<Image> {
		const postEntity = await this.dbContainer.getRepository(PostEntity).findOneOrFail({
			where: {
				"postImages.uuid": uuid,
			} as any,
			relations: {
				postImages: true,
			},
			select: {
				_id: true,
				postImages: {
					path: true,
					uuid: true,
				},
			} as any,
		});

		return ImageMapper.toDomain(postEntity.postImages.find((image) => image.uuid === uuid));
	}

	async updatePost(post: Post): Promise<Post> {
		const postEntity = PostMapper.toEntity(post);

		const postRepository = this.dbContainer.getRepository(PostEntity);
		const postToUpdate = await postRepository.findOneByOrFail({ uuid: post.uuid });

		console.log(postEntity);

		await postRepository.update({ _id: postToUpdate._id }, postEntity);

		return post;
	}

	async getPostById(id: string): Promise<Post> {
		const postEntity = await this.dbContainer.getRepository(PostEntity).findOneByOrFail({
			uuid: id,
		});

		return PostMapper.toDomain(postEntity);
	}
}
