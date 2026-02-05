import Profile from "@profiles/domain/user.js";
import UserEntity from "@profiles/infraestructure/persistance/entities/user.entity.js";

export default class UserMapper {
  static toDomain(userEntity: UserEntity): Profile {
    return new Profile(
      userEntity.username,
      userEntity.uuid,
      userEntity.uuidFriendList.map((uuid) => new Profile("", uuid, [], [])),
      userEntity.uuidBlockList.map((uuid) => new Profile("", uuid, [], [])),
    );
  }

  static toEntity(user: Profile): UserEntity {
    const userEntity = new UserEntity();
    userEntity.username = user.username;
    userEntity.uuid = user.uuid;

    user.friendProfileList.forEach((f) => {
      userEntity.uuidFriendList.push(f.uuid);
    });

    user.blockProfilesList.forEach((b) => {
      userEntity.uuidBlockList.push(b.uuid);
    });

    return userEntity;
  }
}
