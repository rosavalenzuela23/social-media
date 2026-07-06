export default class Profile {
	profilePicture?: string;
	username!: string;
	uuid!: string;
	friendProfileList: Profile[] = [];
	blockProfilesList: Profile[] = [];
}
