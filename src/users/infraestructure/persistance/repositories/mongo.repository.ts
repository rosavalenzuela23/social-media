import type IProfileRepository from "@users//application/ports/user.repository.js";
import { appDataSource as datasorce } from "@shared/infrastructure/persistance/mongo-connection.js";
import Profile from "@users/domain/user.js";
import UserEntity from "@users/infraestructure/persistance/entities/user.entity.js";
import UserMapper from "@users/infraestructure/persistance/mappers/user.mapper.js";
import type { EntityManager } from "typeorm";

export default class MongoRepository implements IProfileRepository {
  private dbContainer = datasorce;

  async getAllUsers(): Promise<Profile[]> {
    const usersEntity = await this.dbContainer.getRepository(UserEntity).find();
    if (!usersEntity) {
      return [];
    }
    return usersEntity.map((userEntity) => UserMapper.toDomain(userEntity));
  }

  async createUser(username: string, password: string): Promise<void> {
    const user = new UserEntity();
    user.username = username;
    user.password = password;
    await this.dbContainer.getRepository(UserEntity).save(user);
  }

  async updateUser(user: Profile): Promise<void> {
    await this.dbContainer.getRepository(UserEntity).update(
      {
        username: user.username,
      },
      user,
    );
  }

  async getUserByUsername(username: string): Promise<Profile | null> {
    const userEntity = await this.dbContainer
      .getRepository(UserEntity)
      .findOne({
        where: {
          username,
        },
      });

    if (!userEntity) {
      return null;
    }

    return UserMapper.toDomain(userEntity);
  }

  async addFriend(user: Profile, userFriend: Profile): Promise<void> {
    const userEntity = UserMapper.toEntity(user);
    const userEntityFriend = UserMapper.toEntity(userFriend);

    await this.dbContainer.transaction(async (manager: EntityManager) => {
      await manager.getRepository(UserEntity).update(
        {
          username: userEntity.username,
        },
        userEntity,
      );

      await manager.getRepository(UserEntity).update(
        {
          username: userEntityFriend.username,
        },
        userEntityFriend,
      );
    });
  }
}
