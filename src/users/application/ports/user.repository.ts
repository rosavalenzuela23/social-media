import User from "@users/domain/user.js";

export default interface IUserRepository {
    getAllUsers(): Promise<User[]>
    createUser(username: string, password: string): Promise<void>
    getUserByUsername(username: string): Promise<User | null>
    updateUser(user: User): Promise<void>
    addFriend(user: User, userFriend: User): Promise<void>
}