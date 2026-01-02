import type { FastifyRequest, FastifyReply } from "fastify";
import PostService from "@posts/application/posts.service.js";
import type { IdUserParams } from './types/types.js'
import MongoRepository from "@posts/infrastructure/persistance/repositories/mongo.repository.js";

const postsService = new PostService(
    new MongoRepository()
);

async function getUserPosts(request: FastifyRequest<{ Params: IdUserParams }>, reply: FastifyReply) {

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