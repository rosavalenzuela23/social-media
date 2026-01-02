import User from "@users/domain/user.js";
import UserEntity from "@users/infraestructure/persistance/entities/user.entity.js";

export default class UserMapper {

    static toDomain(userEntity: UserEntity): User {
        return new User(userEntity.name, userEntity.username, userEntity.password, userEntity.uuid, userEntity.uuidFriendList);
    }

    static toEntity(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.name = user.name;
        userEntity.username = user.username;
        userEntity.password = user.password;
        userEntity.uuid = user.uuid;
        userEntity.uuidFriendList = user.uuidFriendList;
        return userEntity;
    }

}