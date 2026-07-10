import { UserNotFoundException } from "@profiles/application/exceptions.js";
import { IProfileRepository } from "@/profiles/application/ports/profile.repository.js";
import type Profile from "../domain/user.js";
import { inject, injectable } from "tsyringe";
import { IFileManager } from "./ports/file.manager.js";
import { LikeTextEnum } from "../domain/like.enum.js";

@injectable()
export default class ProfileService {
	constructor(
		@inject(IProfileRepository) private profileRepository: IProfileRepository,
		@inject(IFileManager) private fileManager: IFileManager,
	) {}

	async addFriend(username: string, usernameFriend: string) {
		const user = await this.profileRepository.getUserByUsername(username);

		if (!user) {
			throw new UserNotFoundException("User not found");
		}

		const userFriend = await this.profileRepository.getUserByUsername(usernameFriend);

		if (!userFriend) {
			throw new UserNotFoundException("User not found");
		}

		user.addFriend(userFriend);
		userFriend.addFriend(user);

		await this.profileRepository.addFriend(user, userFriend);
	}

	async blockProfile(profileUsername: string, profileUsernameToBlock: string) {
		const profile = await this.profileRepository.getUserByUsername(profileUsername);

		const exception = new UserNotFoundException("The user that your trying to look doesn't exists");

		if (!profile) {
			throw exception;
		}

		const profileToBlock = await this.profileRepository.getUserByUsername(profileUsernameToBlock);

		if (!profileToBlock) {
			throw exception;
		}

		profile.blockProfile(profileToBlock);

		// The block user is going to be able to see other people too
		await this.profileRepository.updateUser(profile);
	}

	async getAllProfiles() {
		return await this.profileRepository.getAllUsers();
	}

	async getBlockedUuidListProfileListByUserUuid(uuid: string): Promise<string[]> {
		const profile = await this.profileRepository.getUserByUuid(uuid);
		if (!profile) {
			throw new UserNotFoundException("User not found");
		}
		return profile.blockProfilesList.map((profile) => profile.uuid);
	}

	async getProfileByUuid(uuid: string): Promise<Profile | null> {
		const profile = await this.profileRepository.getUserByUuid(uuid);
		return profile;
	}

	async getProfilePictureStream(id: string) {
		const profile = await this.profileRepository.getUserByUuid(id);
		if (!profile) {
			throw new UserNotFoundException("User not found");
		}

		return this.fileManager.getReadStreamFromFileName(profile.profilePictureName);
	}

	async updateProfileInfo(userId: string, data: { bio?: string; likeText?: LikeTextEnum }) {
		const user = await this.profileRepository.getUserByUuid(userId);
		if (!user) {
			throw new UserNotFoundException("User not found");
		}

		user.bio = data.bio;
		user.likeText = data.likeText;

		try {
			await this.profileRepository.updateUser(user);
		} catch (err) {
			throw new Error(err?.message || "Failed to update profile");
		}
	}

	async setProfilePicture(userId: string, image: Buffer) {
		const profile = await this.profileRepository.getUserByUuid(userId);
		if (!profile) {
			throw new UserNotFoundException("User not found");
		}

		try {
			await this.fileManager.saveImage(image, `${profile.uuid}/profile`, userId);
		} catch (err) {
			throw new Error(err?.message || "Failed to save image");
		}

		profile.profilePictureName = `${profile.uuid}/profile`;

		try {
			await this.profileRepository.updateUser(profile);
		} catch (err) {
			await this.fileManager.deleteFile(profile.profilePictureName);
			throw new Error(err?.message || "Failed to update profile");
		}
	}

	async createProfile(params: {
		uuid: string;
		username: string;
		name: string;
		interests: string[];
    biography?: string
	}): Promise<Profile | { message: string }> {
		try {
			return await this.profileRepository.createProfile(
				params.uuid,
				params.username,
				params.name,
				params.interests,
        params.biography
			);
		} catch (err) {
			throw new Error(err?.message || "Profile already exists");
		}
	}
}
