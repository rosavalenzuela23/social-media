import type { IUserModulePort } from "@/posts/application/ports/users.module.port.js";
import UserService from "@/profiles/application/user.service.js";

class UserExternalService implements IUserModulePort {
  private userService: UserService;

  private static _instance: UserExternalService | null = null;

  private constructor(userService: UserService) {
    this.userService = userService;
  }

  static getInstance(userService: UserService): UserExternalService {
    return (
      this._instance || (this._instance = new UserExternalService(userService))
    );
  }

  async getBlockedUsersUuid(userUuid: string): Promise<string[]> {
    const blockedUsers =
      await this.userService.getBlockedUuidListProfileListByUserUuid(userUuid);
    return blockedUsers;
  }
}

export default UserExternalService;
