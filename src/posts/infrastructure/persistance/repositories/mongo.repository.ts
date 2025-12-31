import IPostRepository from "../../../application/ports/post.repository";
import datasource from "../../../../shared/infrastructure/persistance/mongo-connection";
import Post from "../../../domain/post";
import PostEntity from "../entities/post.entity";
import PostMapper from "../mappers/post.mapper";

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