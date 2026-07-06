export default class Profile {
	constructor(
		public username: string,
		public uuid: string,
		public friendProfileList: Profile[],
		public blockProfilesList: Profile[],
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
