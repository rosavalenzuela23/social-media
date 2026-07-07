import SharpManager from "@/shared/utils/sharp.converter.js";
import PostgresRepository from "@profiles/infraestructure/persistance/repositories/postgres.repository.js";
import { container } from "tsyringe";
import { IFileManager } from "../application/ports/file.manager.js";
import { IProfileRepository } from "../application/ports/profile.repository.js";

if (!process.env.PROFILE_PICTURES_FOLDER)
	throw new Error("You need the PROFILE_PICTURES_FOLDER variable defined in .env file");

container.register(IProfileRepository, {
	useValue: new PostgresRepository(),
});

container.register(IFileManager, {
	useValue: new SharpManager(process.env.PROFILE_PICTURES_FOLDER as string),
});

export { container };
