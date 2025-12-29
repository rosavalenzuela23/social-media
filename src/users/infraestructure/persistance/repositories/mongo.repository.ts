import IUserRepository from "../../../application/ports/user.repository";
import datasorce from "../../../../shared/infrastructure/mongo-connection";
import User from "../../../domain/user";
import UserEntity from "../entities/user.entity";
import UserMapper from "../mappers/user.mapper";
import type { Entity, EntityManager } from "typeorm";

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

    async addFriend(user: User, userFriend: User): Promise<void> {
        const userEntity = UserMapper.toEntity(user);
        const userEntityFriend = UserMapper.toEntity(userFriend);

        await this.dbContainer.transaction(async (manager: EntityManager) => {
            await manager.getRepository(UserEntity).update({
                username: userEntity.username
            }, userEntity);

            await manager.getRepository(UserEntity).update({
                username: userEntityFriend.username
            }, userEntityFriend);
        });
    }

}