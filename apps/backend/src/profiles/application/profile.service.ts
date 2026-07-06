import { UserNotFoundException } from "@profiles/application/exceptions.js";
import type { IProfileRepository } from "@/profiles/application/ports/profile.repository.js";
import type Profile from "../domain/user.js";
import { inject, injectable } from "tsyringe";

@injectable()
export default class ProfileService {
	constructor(@inject("ProfileRepository") private profileRepository: IProfileRepository) {}

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

	async createProfile(params: {
		uuid: string;
		username: string;
		name: string;
	}): Promise<Profile | { message: string }> {
		try {
			return await this.profileRepository.createProfile(params.uuid, params.username, params.name);
		} catch (err) {
			throw new Error(err?.message || "Profile already exists");
		}
	}
}
