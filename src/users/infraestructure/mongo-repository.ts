import IUserRepository from "../application/ports/UserRepository";
import datasorce from "../../shared/infrastructure/mongo-connection";
import User from "../domain/User";
import UserEntity from "./User.entity";

export default class MongoRepository implements IUserRepository {

    private dbContainer = datasorce;

    async getAllUsers(): Promise<User[]> {
        return this.dbContainer.getRepository(UserEntity).find();
    }

    async createUser(username: string, password: string): Promise<void> {
        const user = new UserEntity();
        user.username = username;
        user.password = password;
        await this.dbContainer.getRepository(UserEntity).save(user);
    }

    async updateUser(user: User): Promise<void> {
        await this.dbContainer.getRepository(UserEntity).update({
            username: user.username
        }, user);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.dbContainer.getRepository(UserEntity).findOne({
            where: {
                username
            }
        });
    }

}