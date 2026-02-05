import type { FileManager } from "../../application/ports/file.manager.js";
import fs, { ReadStream } from "fs";
import sharp from "sharp";

class SharpManager implements FileManager {
  constructor(private filePath: string) {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
  }

  async saveImage(buffer: Buffer, name: string): Promise<void> {
    const bufferImage = sharp(buffer);
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
    const readableStream = fs.createReadStream(
      this.filePath + fileName + ".webp",
    );
    return readableStream;
  }
}

export default SharpManager;
