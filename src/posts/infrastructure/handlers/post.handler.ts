import { FastifyRequest } from "fastify";
import PostService from "../../application/posts.service";
import MongoRepository from "../persistance/repositories/mongo.repository";
import { FastifyReply } from "fastify";

const postsService = new PostService(
    new MongoRepository()
);

async function getUserPosts(request: FastifyRequest, reply: FastifyReply) {
    if (!request.session.user) {
        reply.status(401);
        return { message: "Unauthorized" };
    }

    return postsService.getUserPosts(request.params.uuid);
}

async function getUserLoggedPosts(request: FastifyRequest) {
    const userId = request.session.user.uuid;
    return await postsService.getUserPosts(userId);
}

async function getAllPosts() {
    return await postsService.getAllPosts();
}

async function createPost(request: FastifyRequest) {
    for (let path in request.files) {
        console.log(path);
    }
    // return await postsService.createPost(request.session.user.uuid, request.);
}

export {
    getUserPosts,
    getUserLoggedPosts,
    getAllPosts,
    createPost
}