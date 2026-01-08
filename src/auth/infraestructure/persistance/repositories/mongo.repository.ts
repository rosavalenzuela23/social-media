import { type IUserRepository } from "@/auth/application/ports/user.port.js";
import { appDataSource as datasorce } from "@shared/infrastructure/persistance/mongo-connection.js";
import User from "@auth/domain/user.js";
import UserEntity from "@auth/infraestructure/persistance/entities/user.entity.js";
import UserMapper from "@auth/infraestructure/persistance/mappers/user.mapper.js";

export default class MongoRepository implements IUserRepository {

    private dbContainer = datasorce;

    async getAllUsers(): Promise<User[]> {
        const usersEntity = await this.dbContainer.getRepository(UserEntity).find();
        if (!usersEntity) {
            return [];
        }
        return usersEntity.map(userEntity => UserMapper.toDomain(userEntity));
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
        const userEntity = await this.dbContainer.getRepository(UserEntity).findOne({
            where: {
                username
            }
        });

        if (!userEntity) {
            return null;
        }

        return UserMapper.toDomain(userEntity);
    }

}