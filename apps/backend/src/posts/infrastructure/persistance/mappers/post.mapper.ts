import Post, { PostBuilder } from "@posts/domain/post.js";
import PostEntity from "@posts/infrastructure/persistance/entities/post.entity.js";
import ImageMapper from "./image.mapper.js";
import CommentMapper from "./comment.mapper.js";
import LikeMapper from "./like.mapper.js";

export default class PostMapper {
	static toEntity(post: Post): PostEntity {
		const postEntity = new PostEntity();
		postEntity.creatorUuid = post.creatorUuid;
		postEntity.creatorUsername = post.creatorUsername;
		postEntity.message = post.message;
		postEntity.createdAt = post.date;
		postEntity.postImages = post.images?.map((image) => ImageMapper.toEntity(image));
		postEntity.userUuidExcludeList = post.userUuidExcludeList || [];
		postEntity.categories = post.categories || [];
		if (post.comments) {
			postEntity.comments = post.comments.map((comment) => CommentMapper.toEntity(comment));
		}
		if (post.likes) {
			postEntity.likes = post.likes.map((like) => LikeMapper.toEntity(like));
		}
		return postEntity;
	}

	static toDto(post: Post, includeComments: boolean = true) {
		return {
			creatorUuid: post.creatorUuid,
			creatorUsername: post.creatorUsername,
			message: post.message,
			date: post.date,
			images: post.images?.map((image) => ImageMapper.toDto(image)),
			uuid: post.uuid,
			comments: includeComments
				? {
						total: post.comments.length,
						list: post.comments?.map((comment) => CommentMapper.toDto(comment)),
					}
				: {
						total: post.comments.length,
						list: null,
					},
			likes: post.likes?.map((like) => LikeMapper.toDto(like)) || [],
			categories: post.categories || [],
		};
	}

	static toDomain(postEntity: PostEntity): Post {
		const post = new PostBuilder()
			.setCreator(postEntity.creatorUuid, postEntity.creatorUsername)
			.setMessage(postEntity.message)
			.setDate(postEntity.createdAt)
			.setExcludeList(postEntity.userUuidExcludeList)
			.addImages(postEntity.postImages?.map((image) => ImageMapper.toDomain(image)))
			.setCategories(postEntity.categories || [])
			.setUuid(postEntity.uuid)
			.setComments(postEntity.comments?.map((comment) => CommentMapper.toDomain(comment)))
			.setLikes(postEntity.likes?.map((like) => LikeMapper.toDomain(like)))
			.build();

		return post;
	}
}
