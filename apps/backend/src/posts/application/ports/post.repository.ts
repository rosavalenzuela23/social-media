import Post from "@posts/domain/post.js";
import type Image from "@/posts/domain/image.js";

interface IPostRepository {
	getAllPosts(
		userUuid: string,
		page: number,
		size: number,
		userUuidExclude?: string[],
	): Promise<Post[]>;

	getUserPosts(userId: string): Promise<Post[]>;
	createPost(post: Post): Promise<void>;
	getImageByUuid(uuid: string): Promise<Image>;
	getPostById(id: string): Promise<Post>;
	updatePost(post: Post): Promise<Post>;
}

export type { IPostRepository };
