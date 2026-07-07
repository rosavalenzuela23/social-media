import Profile from "@profiles/domain/user.js";
import ProfileEntity from "@/profiles/infraestructure/persistance/entities/profile.entity.js";

export default class ProfileMapper {
	static toDomain(userEntity: ProfileEntity): Profile {
		return new Profile(
			userEntity.username,
			userEntity.uuid,
			userEntity.uuidFriendList.map((uuid) => new Profile("", uuid, [], [])),
			userEntity.uuidBlockList.map((uuid) => new Profile("", uuid, [], [])),
			userEntity.profilePictureName,
		);
	}

	static toDto(user: Profile) {
		return {
			username: user.username,
			uuid: user.uuid,
			friendProfileList: user.friendProfileList.map((profile) => ProfileMapper.toDto(profile)),
			profilePictureName: user.profilePictureName,
		};
	}

	static toEntity(user: Profile): ProfileEntity {
		const userEntity = new ProfileEntity();
		userEntity.username = user.username;
		userEntity.uuid = user.uuid;
		userEntity.profilePictureName = user.profilePictureName;

		user.friendProfileList.forEach((f) => {
			userEntity.uuidFriendList.push(f.uuid);
		});

		user.blockProfilesList.forEach((b) => {
			userEntity.uuidBlockList.push(b.uuid);
		});

		return userEntity;
	}
}
