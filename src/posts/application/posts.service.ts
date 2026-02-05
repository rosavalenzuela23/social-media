import Post from "@posts/domain/post.js";
import type { IPostRepository } from "@posts/application/ports/post.repository.js";
import { ReadStream } from "fs";
import { v4 as uuidv4 } from "uuid";
import Image from "../domain/image.js";
import type { FileManager } from "@posts/application/ports/file.manager.js";
import type { IUserModulePort } from "./ports/users.module.port.js";

export default class PostService {
  constructor(
    private postRepository: IPostRepository,
    private userModulePort: IUserModulePort,
    private fileManager: FileManager,
  ) {}

  async getAllPosts(page: number, size: number, userUuid: string) {
    let blockedUsersUuid: string[] = [];

    try {
      blockedUsersUuid =
        await this.userModulePort.getBlockedUsersUuid(userUuid);
    } catch (error) {
      console.error(error);
    }

    return await this.postRepository.getAllPosts(
      userUuid,
      page,
      size,
      blockedUsersUuid,
    );
  }

  async getUserPosts(creatorUuid: string) {
    return await this.postRepository.getUserPosts(creatorUuid);
  }

  async createPost(
    userUuid: string,
    username: string,
    message: string,
    imagesBuffer?: Buffer[],
  ) {
    //Obtener toda la informacion del usuario
    const images: Image[] = [];
    try {
      for (const buffer of imagesBuffer) {
        const uuid = uuidv4();
        await this.fileManager.saveImage(buffer, uuid);
        const image = new Image(uuid + ".webp", uuid);
        images.push(image);
      }

      const post = new Post(
        userUuid,
        username,
        message,
        new Date(),
        [],
        images,
      );

      return await this.postRepository.createPost(post);
    } catch (error) {
      console.log(error);
      for (const image of images) {
        await this.fileManager.deleteFile(image.uuid);
      }
      throw error;
    }
  }

  async getImageBufferById(uuid: string): Promise<ReadStream> {
    const image = await this.postRepository.getImageByUuid(uuid);
    return this.fileManager.getReadStreamFromFileName(image.uuid);
  }
}
