import type { IUserModulePort } from "@/posts/application/ports/users.module.port.js";
import ProfileService from "@/profiles/application/profile.service.js";

class UserExternalService implements IUserModulePort {
	private userService: ProfileService;

	private static _instance: UserExternalService | null = null;

	private constructor(userService: ProfileService) {
		this.userService = userService;
	}

	static getInstance(userService: ProfileService): UserExternalService {
		return this._instance || (this._instance = new UserExternalService(userService));
	}

	async getBlockedUsersUuid(userUuid: string): Promise<string[]> {
		const blockedUsers = await this.userService.getBlockedUuidListProfileListByUserUuid(userUuid);
		return blockedUsers;
	}
}

export default UserExternalService;
