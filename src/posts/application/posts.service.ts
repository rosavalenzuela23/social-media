import Post from "../domain/post";
import IPostRepository from "./ports/post.repository";


export default class PostService {

    constructor(
        private postRepository: IPostRepository
    ) {

    }

    async getAllPosts() {
        return await this.postRepository.getAllPosts();
    }

    async getUserPosts(creatorUuid: string) {
        return await this.postRepository.getUserPosts(creatorUuid);
    }

    async createPost(userUuid: string, message: string) {
        //Obtener toda la informacion del usuario
        const post = new Post(userUuid, message, new Date());
        return await this.postRepository.createPost(post);
    }

}