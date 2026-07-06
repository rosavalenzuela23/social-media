import type Role from "./role.js";

export default class User {
	constructor(
		public name: string,
		public username: string,
		public password: string,
		public uuid: string,
		public roles: Role[] = [],
	) {}
}
