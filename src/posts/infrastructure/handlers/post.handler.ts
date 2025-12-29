import PostService from "../../application/posts.service";
import MongoRepository from "../persistance/repositories/mongo.repository";

const postsService = new PostService(
    new MongoRepository()
);

async function getUserPosts(request, reply) {
    if (!request.session.user) {
        reply.status(401);
        return { message: "Unauthorized" };
    }

    return postsService.getUserPosts(request.params.uuid);
}

async function getUserLoggedPosts(request) {
    const userId = request.session.user.uuid;
    return await postsService.getUserPosts(userId);
}

async function getAllPosts() {
    return await postsService.getAllPosts();
}

async function createPost(request) {
    return await postsService.createPost(request.session.user.uuid, request.body.content);
}

export {
    getUserPosts,
    getUserLoggedPosts,
    getAllPosts,
    createPost
}