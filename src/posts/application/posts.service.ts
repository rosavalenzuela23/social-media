import Post from "@posts/domain/post.js";
import type IPostRepository from "@posts/application/ports/post.repository.js";
import fs, { ReadStream } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from "uuid";
import Image from "../domain/image.js";
import sharp from "sharp";

export default class PostService {

    constructor(
        private postRepository: IPostRepository
    ) {

    }

    async getAllPosts() {
        return await this.postRepository.getAllPosts();
    }

    async getUserPosts(creatorUuid: string) {
        return await this.postRepository.getUserPosts(creatorUuid);
    }

    async createPost(userUuid: string, message: string, imagesBuffer?: Buffer[]) {
        //Obtener toda la informacion del usuario
        const relativePath = path.join(__dirname, 'uploads', 'images');

        const images: Image[] = [];
        try {
            if (!fs.existsSync(relativePath)) {
                fs.mkdirSync(relativePath, { recursive: true });
            }

            for (const buffer of imagesBuffer) {
                const uuid = uuidv4();
                const image = new Image(path.join(__dirname, 'uploads', 'images', uuid + '.webp'), uuid);
                await sharp(buffer).toFile(image.path);
                images.push(image);
            }
            
            const post = new Post(userUuid, message, new Date(), images);

            return await this.postRepository.createPost(post);
        } catch (error) {
            console.log(error);
            for (const image of images) {
                fs.unlinkSync(image.path);
            }
            throw error;
        }

    }

    async getImageBufferById(uuid: string): Promise<ReadStream> {
        const image = await this.postRepository.getImageByUuid(uuid);
        const readableStream = fs.createReadStream(image.path);
        return readableStream;
    }

} 