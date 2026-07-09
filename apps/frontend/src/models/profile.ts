export default class Profile {
	profilePictureName?: string;
	username!: string;
	uuid!: string;
	friendProfileList: Profile[] = [];
	blockProfilesList: Profile[] = [];
	bio?: string;
	likeText?: string;
}
