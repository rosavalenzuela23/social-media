import Comment, { CommentBuilder } from "@posts/domain/comment.js";
import CommentEntity from "../entities/comment.entity.js";

export default class CommentMapper {
	static toEntity(comment: Comment): CommentEntity {
		const commentEntity = new CommentEntity();
		commentEntity.creatorUuid = comment.creatorUuid;
		commentEntity.creatorUsername = comment.creatorUsername;
		commentEntity.message = comment.message;
		commentEntity.date = comment.date;
		commentEntity.postUuid = comment.postUuid;
		commentEntity.uuid = comment.uuid;
		return commentEntity;
	}

	static toDomain(commentEntity: CommentEntity): Comment {
		const comment = new CommentBuilder()
			.setCreator(commentEntity.creatorUuid, commentEntity.creatorUsername)
			.setMessage(commentEntity.message)
			.setDate(commentEntity.date)
			.setUuid(commentEntity.uuid)
			.setPostUuid(commentEntity.postUuid)
			.build();
		return comment;
	}

	static toDto(comment: Comment) {
		return {
			uuid: comment.uuid,
			message: comment.message,
			date: comment.date,
			creatorUuid: comment.creatorUuid,
			creatorUsername: comment.creatorUsername,
			postUuid: comment.postUuid,
		};
	}
}
