import Post from "@posts/domain/post.js";
import PostEntity from "@posts/infrastructure/persistance/entities/post.entity.js";

export default class PostMapper {
    static toEntity(post: Post): PostEntity {
        const postEntity = new PostEntity();
        postEntity.creatorUuid = post.creatorUuid;
        postEntity.message = post.message;
        postEntity.createdAt = post.date;
        return postEntity;
    }

    static toDomain(postEntity: PostEntity): Post {
        return new Post(postEntity.creatorUuid, postEntity.message, postEntity.createdAt);
    }

}