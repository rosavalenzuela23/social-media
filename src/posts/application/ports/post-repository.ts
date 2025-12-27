import PostDTO from "../../domain/postdto";

export default interface IPostRepository {
    getUserPosts(userId: number): Promise<PostDTO[]>
    createPost(userUuid: string, message: string): Promise<void>
}