import type Image from '@/posts/domain/image.js';
import type { IPostRepository } from '@posts/application/ports/post.repository.js';
import Post from '@posts/domain/post.js';
import PostEntity from '@posts/infrastructure/persistance/entities/post.entity.js';
import PostMapper from '@posts/infrastructure/persistance/mappers/post.mapper.js';
import { appDataSource as datasource } from '@shared/infrastructure/persistance/mongo-connection.js';
import ImageMapper from '../mappers/image.mapper.js';

export default class MongoRepository implements IPostRepository {
  private dbContainer = datasource;

  async getAllPosts(
    userUuid: string,
    page: number,
    size: number,
    userUuidExcludeList?: string[]
  ): Promise<Post[]> {
    const posts = await this.dbContainer.getRepository(PostEntity).find({
      skip: page * size,
      take: size,
      order: {
        createdAt: "DESC"
      },
      where: {
        userUuidExcludeList: {
          $nin: [userUuid],
        },
        creatorUuid: {
          $nin: userUuidExcludeList,
        }
      },
    });
    return posts.map((post) => PostMapper.toDomain(post));
  }

  async getUserPosts(userUuid: string): Promise<Post[]> {
    const posts = await this.dbContainer.getRepository(PostEntity).find({
      where: {
        creatorUuid: userUuid,
      },
    });

    return posts.map((post) => PostMapper.toDomain(post));
  }

  async createPost(post: Post): Promise<void> {
    const postEntity = PostMapper.toEntity(post);
    await this.dbContainer.getRepository(PostEntity).save(postEntity);
  }

  async getImageByUuid(uuid: string): Promise<Image> {
    const postEntity = await this.dbContainer
      .getRepository(PostEntity)
      .findOneOrFail({
        where: {
          postImages: {
            uuid: uuid,
          }
        },
        relations: {
          postImages: true,
        },
        select: {
          id: true,
          postImages: {
            path: true,
            uuid: true,
          },
        },
      });

    return ImageMapper.toDomain(
      postEntity.postImages.find((image) => image.uuid === uuid)
    );
  }
}
