import Like from "@posts/domain/like.js";
import LikeEntity from "../entities/like.entity.js";

export default class LikeMapper {
	static toEntity(like: Like): LikeEntity {
		const likeEntity = new LikeEntity();
		likeEntity.userUuid = like.userUuid;
		likeEntity.username = like.username;
		likeEntity.postId = like.postId;
		likeEntity.createdAt = like.createdAt;
		return likeEntity;
	}

	static toDomain(likeEntity: LikeEntity): Like {
		const like = new Like();
		like.userUuid = likeEntity.userUuid;
		like.username = likeEntity.username;
		like.postId = likeEntity.postId;
		like.createdAt = likeEntity.createdAt;
		return like;
	}

	static toDto(like: Like) {
		return {
			userUuid: like.userUuid,
			username: like.username,
			postId: like.postId,
			createdAt: like.createdAt,
		};
	}
}
