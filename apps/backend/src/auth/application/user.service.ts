import { UserAlreadyExistsException, UserNotFoundException } from "@auth/application/exceptions.js";
import type { IUserRepository } from "@/auth/application/ports/user.port.js";
import bcrypt from "bcrypt";

export default class UserService {
	constructor(private userRepository: IUserRepository) {}

	async login(username: string, plainPassword: string) {
		const user = await this.userRepository.getUserByUsername(username);

		if (!user) {
			throw new UserNotFoundException("User not found");
		}

		const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

		if (!isPasswordValid) {
			throw new UserNotFoundException("Invalid password");
		}

		user.lastLogin = new Date();
		return user;
	}

	async getUserRoles(username: string): Promise<string[]> {
		const user = await this.userRepository.getUserByUsername(username);
		return user.roles.map((role) => role.name);
	}

	async getAllUsers() {
		return await this.userRepository.getAllUsers();
	}

	async createUser(username: string, password: string): Promise<string> {
		const user = await this.userRepository.getUserByUsername(username);

		if (user != null) {
			throw new UserAlreadyExistsException(`User with username ${username} already exists`);
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		await this.userRepository.createUser(username, hashPassword);

		return "User created successfully";
	}
}
