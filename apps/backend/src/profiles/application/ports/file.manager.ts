import type { ReadStream } from "typeorm/platform/PlatformTools.js";

interface IFileManager {
	saveImage(buffer: Buffer, name: string, parent: string): Promise<void>;
	deleteFile(name: string): Promise<void>;
	getReadStreamFromFileName(fileName: string): ReadStream;
}

const IFileManager = Symbol("IFileManagerProfile");
export { IFileManager };
