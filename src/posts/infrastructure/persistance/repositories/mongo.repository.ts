import type IPostRepository from "@posts/application/ports/post.repository.js";
import { appDataSource as datasource } from "@shared/infrastructure/persistance/mongo-connection.js";
import Post from "@posts/domain/post.js";
import PostEntity from "@posts/infrastructure/persistance/entities/post.entity.js";
import PostMapper from "@posts/infrastructure/persistance/mappers/post.mapper.js";

export default class MongoRepository implements IPostRepository {

    private dbContainer = datasource;

    async getAllPosts(): Promise<Post[]> {
        const posts = await this.dbContainer.getRepository(PostEntity).find();
        return posts.map(post => new Post(post.creatorUuid, post.message, post.createdAt));
    }

    async getUserPosts(userUuid: string): Promise<Post[]> {

        const posts = await this.dbContainer.getRepository(PostEntity).find({
            where: {
                creatorUuid: userUuid
            }
        });

        return posts.map(post => new Post(post.creatorUuid, post.message, post.createdAt));
    }

    async createPost(post: Post): Promise<void> {
        const postEntity = PostMapper.toEntity(post);
        await this.dbContainer.getRepository(PostEntity).save(postEntity);
    }

}