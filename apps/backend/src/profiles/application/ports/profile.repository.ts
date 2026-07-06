import Profile from "@profiles/domain/user.js";

interface IProfileRepository {
	getAllUsers(): Promise<Profile[]>;
	createProfile(uuid: string, username: string, name: string): Promise<Profile>;
	getUserByUsername(username: string): Promise<Profile | null>;
	getUserByUuid(uuid: string): Promise<Profile | null>;
	updateUser(user: Profile): Promise<void>;
	addFriend(user: Profile, userFriend: Profile): Promise<void>;
}

export type { IProfileRepository };
