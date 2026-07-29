import type { LikeTextEnum } from "./like.enum.js";

export default class Profile {
	constructor(
		public username: string,
		public name: string,
		public uuid: string,
		public friendProfileList: Profile[],
		public blockProfilesList: Profile[],
		public interests: string[],
		public profilePictureName?: string,
		public bio?: string,
		public likeText?: LikeTextEnum,
	) {}

	private itsMyProfile(profile: Profile): boolean {
		return profile.uuid === this.uuid;
	}

	blockProfile(profile: Profile) {
		if (this.itsMyProfile(profile)) {
			throw new Error("You cannot block yourself");
		}

		if (this.blockProfilesList.find((p) => p.uuid == profile.uuid)) {
			throw new Error("You cannot block this profile twice");
		}

		this.blockProfilesList.push(profile);
	}

	addFriend(profile: Profile) {
		if (this.itsMyProfile(profile)) {
			throw new Error("You cannot add yourself as friend");
		}

		if (this.friendProfileList.find((p) => p.uuid == profile.uuid)) {
			return;
		}

		this.friendProfileList.push(profile);
	}
}

export class UserBuilder {
	private username?: string;
	private name?: string;
	private uuid?: string;
	private friendProfileList: Profile[] = [];
	private blockProfilesList: Profile[] = [];
	private interests: string[] = [];
	private profilePictureName?: string;
	private bio?: string;
	private likeText?: LikeTextEnum;

	public setUsername(username: string): UserBuilder {
		this.username = username;
		return this;
	}

	public setName(name: string): UserBuilder {
		this.name = name;
		return this;
	}

	public setUuid(uuid: string): UserBuilder {
		this.uuid = uuid;
		return this;
	}

	public setFriendProfileList(list: Profile[]): UserBuilder {
		this.friendProfileList = list;
		return this;
	}

	public setBlockProfilesList(list: Profile[]): UserBuilder {
		this.blockProfilesList = list;
		return this;
	}

	public setInterests(interests: string[]): UserBuilder {
		this.interests = interests;
		return this;
	}

	public setProfilePictureName(name: string): UserBuilder {
		this.profilePictureName = name;
		return this;
	}

	public setBio(bio: string): UserBuilder {
		this.bio = bio;
		return this;
	}

	public setLikeText(likeText: LikeTextEnum): UserBuilder {
		this.likeText = likeText;
		return this;
	}

	public build(): Profile {
		if (!this.username || !this.uuid || !this.name) {
			throw new Error("Required fields are missing: username, uuid, name");
		}

		return new Profile(
			this.username,
			this.name,
			this.uuid,
			this.friendProfileList,
			this.blockProfilesList,
			this.interests,
			this.profilePictureName,
			this.bio,
			this.likeText,
		);
	}
}
