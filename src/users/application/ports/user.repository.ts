import User from "../../domain/user";

export default interface IUserRepository {
    getAllUsers(): Promise<User[]>
    createUser(username: string, password: string): Promise<void>
    getUserByUsername(username: string): Promise<User | null>
    updateUser(user: User): Promise<void>
    addFriend(user: User, userFriend: User): Promise<void>
}