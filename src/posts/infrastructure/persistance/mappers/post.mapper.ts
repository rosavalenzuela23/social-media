import Post from "@posts/domain/post.js";
import PostEntity from "@posts/infrastructure/persistance/entities/post.entity.js";
import ImageMapper from "./image.mapper.js";

export default class PostMapper {
    static toEntity(post: Post): PostEntity {
        const postEntity = new PostEntity();
        postEntity.creatorUuid = post.creatorUuid;
        postEntity.message = post.message;
        postEntity.createdAt = post.date;
        postEntity.postImages = post.images.map(image => ImageMapper.toEntity(image));
        return postEntity;
    }

    static toDomain(postEntity: PostEntity): Post {
        return new Post(
            postEntity.creatorUuid, 
            postEntity.message, 
            postEntity.createdAt, 
            postEntity.postImages.map(path => ImageMapper.toDomain(path)), 
            postEntity.comments?.map(comment => PostMapper.toDomain(comment))
        );
    }

} 