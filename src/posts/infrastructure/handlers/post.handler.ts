import type { FastifyRequest, FastifyReply } from "fastify";
import PostService from "@posts/application/posts.service.js";
import type { IdUserParams } from './types/types.js'
import MongoRepository from "@posts/infrastructure/persistance/repositories/mongo.repository.js";
import { ReadableStream } from "node:stream/web";

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

async function getImageByuuid(request: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) {
    const stream = await postsService.getImageBufferById(request.params.uuid);

    reply
        .type('image/webp')
        .header('Content-Disposition', 'attachment; filename="image.webp"')
        .send(stream);
}

async function createPost(request: FastifyRequest<{
    Body: {
        message: string,
        images?: any[]
    }
}>) {

    const buffers = [];
    for (let image of request.body.images) {
        const buffer = await image.toBuffer();
        buffers.push(buffer);
    }

    return await postsService.createPost(request.session.user.uuid, request.body.message, buffers);
}

export {
    getUserPosts,
    getUserLoggedPosts,
    getAllPosts,
    createPost,
    getImageByuuid
}