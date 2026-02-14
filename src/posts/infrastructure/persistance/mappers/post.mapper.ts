import Post, { PostBuilder } from '@posts/domain/post.js';
import PostEntity from '@posts/infrastructure/persistance/entities/post.entity.js';
import ImageMapper from './image.mapper.js';

export default class PostMapper {
  static toEntity(post: Post): PostEntity {
    const postEntity = new PostEntity();
    postEntity.creatorUuid = post.creatorUuid;
    postEntity.creatorUsername = post.creatorUsername;
    postEntity.message = post.message;
    postEntity.createdAt = post.date;
    postEntity.postImages = post.images.map((image) =>
      ImageMapper.toEntity(image)
    );
    postEntity.userUuidExcludeList = post.userUuidExcludeList || [];
    return postEntity;
  }

  static toDomain(postEntity: PostEntity): Post {
    const post = new PostBuilder()
      .setCreator(postEntity.creatorUuid, postEntity.creatorUsername)
      .setMessage(postEntity.message)
      .setDate(postEntity.createdAt)
      .setExcludeList(postEntity.userUuidExcludeList)
      .addImages(
        postEntity.postImages.map((image) => ImageMapper.toDomain(image))
      )
      .setUuid(postEntity.uuid)
      .build();
    return post;
  }
}
