export default class Profile {
	name!: string;
	profilePictureName?: string;
	username!: string;
	uuid!: string;
	friendProfileList: Profile[] = [];
	blockProfilesList: Profile[] = [];
	bio?: string;
	likeText?: string;
}
