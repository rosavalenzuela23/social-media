import Post from "../../domain/post"

export default interface IPostRepository {
    getAllPosts(): Promise<Post[]>
    getUserPosts(userId: string): Promise<Post[]>
    createPost(post: Post): Promise<void>
}