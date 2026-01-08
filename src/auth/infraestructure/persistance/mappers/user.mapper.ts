import User from "@auth/domain/user.js";
import UserEntity from "@auth/infraestructure/persistance/entities/user.entity.js";

export default class UserMapper {

    static toDomain(userEntity: UserEntity): User {
        return new User(
            userEntity.name,
            userEntity.username,
            userEntity.password,
            userEntity.uuid,
        );
    }

    static toEntity(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.name = user.name;
        userEntity.username = user.username;
        userEntity.password = user.password;
        userEntity.uuid = user.uuid;
        return userEntity;
    }

}