export default class Profile {
  username!: string;
  uuid!: string;
  friendProfileList: Profile[] = [];
  blockProfilesList: Profile[] = [];
}
