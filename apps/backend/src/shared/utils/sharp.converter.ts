import type { FileManager as FileManagerPost } from "@posts/application/ports/file.manager.js";
import type { IFileManager as FileManagerProfile } from "@profiles/application/ports/file.manager.js";

import fs, { ReadStream } from "fs";
import fsPromise from "fs/promises";
import sharp from "sharp";
import { injectable } from "tsyringe";

@injectable()
class SharpManager implements FileManagerPost, FileManagerProfile {
	constructor(private filePath: string) {
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath, { recursive: true });
		}
	}

	async saveImage(buffer: Buffer, name: string, parent?: string): Promise<void> {
		const bufferImage = sharp(buffer);

		if (parent) {
			try {
				await fsPromise.access(this.filePath + parent);
			} catch (err) {
				console.log(`Creating folder-user for: ${parent}`);
				await fsPromise.mkdir(this.filePath + parent, { recursive: true });
			}
		}

		await bufferImage.toFile(this.filePath + name + ".webp");
	}

	async deleteFile(name: string): Promise<void> {
		const promise = new Promise<void>((resolve, reject) => {
			fs.unlink(this.filePath + name + ".webp", (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});

		await promise;
	}

	getReadStreamFromFileName(fileName: string): ReadStream {
		const readableStream = fs.createReadStream(this.filePath + fileName + ".webp");
		return readableStream;
	}
}

export default SharpManager;
