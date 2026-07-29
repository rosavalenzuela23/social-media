interface IUserModulePort {
	getBlockedUsersUuid(userUuid: string): Promise<string[]>;
	getUserInterests(userUuid: string): Promise<string[]>;
}

export type { IUserModulePort };
