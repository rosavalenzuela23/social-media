import type { ReadStream } from "typeorm/platform/PlatformTools.js";

interface FileManager {
	saveImage(buffer: Buffer, name: string): Promise<void>;
	deleteFile(name: string): Promise<void>;
	getReadStreamFromFileName(fileName: string): ReadStream;
}

export type { FileManager };
