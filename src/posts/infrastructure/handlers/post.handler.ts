import type { FastifyRequest, FastifyReply } from "fastify";
import PostService from "@posts/application/posts.service.js";
import type { IdUserParams } from "./types/types.js";
import MongoRepository from "@posts/infrastructure/persistance/repositories/mongo.repository.js";
import SharpManager from "@posts/infrastructure/utils/sharp.converter.js";
import { UPLOAD_DIR } from "../utils/paths.js";

class PostController {
  private static _instance: PostController | null = null;

  private postsService: PostService;

  private constructor() {
    this.postsService = new PostService(
      new MongoRepository(),
      new SharpManager(UPLOAD_DIR),
    );
  }

  static get instance(): PostController {
    return this._instance || (this._instance = new this());
  }

  async getUserPosts(
    request: FastifyRequest<{ Params: IdUserParams }>,
    reply: FastifyReply,
  ) {
    if (!request.session.user) {
      reply.status(401);
      return { message: "Unauthorized" };
    }

    return this.postsService.getUserPosts(request.params.uuid);
  }

  async getUserLoggedPosts(request: FastifyRequest) {
    const userId = request.session.user.uuid;
    return await this.postsService.getUserPosts(userId);
  }

  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }

  async getImageByuuid(
    request: FastifyRequest<{ Params: { uuid: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const stream = await this.postsService.getImageBufferById(
        request.params.uuid,
      );

      reply.type("image/webp");
      return stream;
    } catch {
      reply.status(404);
      return { message: "Image not found" };
    }
  }

  async createPost(
    request: FastifyRequest<{
      Body: {
        content: { value: string };
        images?: any[] | any;
      };
    }>,
  ) {
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

    return await this.postsService.createPost(
      request.session.user.uuid,
      request.session.user.username,
      request.body.content.value,
      buffers,
    );
  }
}

export default PostController;
