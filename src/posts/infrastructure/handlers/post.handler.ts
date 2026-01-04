import type { FastifyRequest, FastifyReply } from "fastify";
import PostService from "@posts/application/posts.service.js";
import type { IdUserParams } from './types/types.js';
import MongoRepository from "@posts/infrastructure/persistance/repositories/mongo.repository.js";
import SharpManager from "@posts/infrastructure/utils/sharp.converter.js";

const postsService = new PostService(
    new MongoRepository(),
    new SharpManager(process.env.UPLOAD_FOLDER || './public/images/')
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
        .header('Content-Disposition', 'attachment; filename="image.webp"');

    return stream;
}

async function createPost(request: FastifyRequest<{
    Body: {
        content: { value: string },
        images?: any[] | any
    }
}>) {

    let images = request.body.images;

    if (request.body.images && !Array.isArray(request.body.images)) {
        images = [request.body.images];   
    }

    const buffers = [];

    if (images) {
        for (const image of images) {
            const buffer = await image.toBuffer();
            buffers.push(buffer);
        }
    }

    return await postsService.createPost(request.session.user.uuid, request.body.content.value, buffers);
}

export {
    getUserPosts,
    getUserLoggedPosts,
    getAllPosts,
    createPost,
    getImageByuuid
};