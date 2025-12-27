import IPostRepository from "../application/ports/post-repository";
import PostDTO from "../domain/postdto";
import datasource from "../../shared/infrastructure/mongo-connection";

export default class MongoRepository implements IPostRepository {

    private dbContainer = datasource;

    getUserPosts(userId: number): Promise<PostDTO[]> {
        throw new Error("Method not implemented.");
    }
    async createPost(userUuid: string, message: string): Promise<void> {



    }

}