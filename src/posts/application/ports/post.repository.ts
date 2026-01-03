import Post from "@posts/domain/post.js"
import type Image from "@/posts/domain/image.js";

export default interface IPostRepository {
    getAllPosts(): Promise<Post[]>
    getUserPosts(userId: string): Promise<Post[]>
    createPost(post: Post): Promise<void>
    getImageByUuid(uuid: string): Promise<Image>; 
}