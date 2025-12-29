import Post from "../../../domain/post";
import PostEntity from "../entities/post.entity";

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