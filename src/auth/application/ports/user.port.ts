import User from "@auth/domain/user.js";

interface IUserRepository {
    getAllUsers(): Promise<User[]>
    createUser(username: string, password: string): Promise<void>
    getUserByUsername(username: string): Promise<User | null>
    updateUser(user: User): Promise<void>
}

export type {
    IUserRepository
};