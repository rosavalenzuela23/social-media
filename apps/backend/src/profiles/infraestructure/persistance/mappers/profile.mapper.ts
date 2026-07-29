import Profile from "@profiles/domain/user.js";
import ProfileEntity from "@/profiles/infraestructure/persistance/entities/profile.entity.js";

export default class ProfileMapper {
	static toDomain(userEntity: ProfileEntity): Profile {
		return new Profile(
			userEntity.username,
			userEntity.name,
			userEntity.uuid,
			userEntity.uuidFriendList.map((uuid) => new Profile("", "", uuid, [], [], [])),
			userEntity.uuidBlockList.map((uuid) => new Profile("", "", uuid, [], [], [])),
			userEntity.interests || [],
			userEntity.profilePictureName,
			userEntity.bio,
			userEntity.likeText,
		);
	}

	static toDto(user: Profile) {
		return {
			username: user.username,
			name: user.name,
			uuid: user.uuid,
			friendProfileList: user.friendProfileList.map((profile) => ProfileMapper.toDto(profile)),
			interests: user.interests,
			profilePictureName: user.profilePictureName,
			bio: user.bio,
			likeText: user.likeText,
		};
	}

	static toEntity(user: Profile): ProfileEntity {
		const userEntity = new ProfileEntity();
		userEntity.username = user.username;
		userEntity.name = user.name;
		userEntity.uuid = user.uuid;
		userEntity.interests = user.interests;
		userEntity.profilePictureName = user.profilePictureName;
		userEntity.bio = user.bio;
		userEntity.likeText = user.likeText;

		user.friendProfileList.forEach((f) => {
			userEntity.uuidFriendList.push(f.uuid);
		});

		user.blockProfilesList.forEach((b) => {
			userEntity.uuidBlockList.push(b.uuid);
		});

		return userEntity;
	}
}
