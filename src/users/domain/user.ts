export default class User {

    constructor(public name: string, public username: string, public password: string, public uuid: string, public uuidFriendList: string[]) {

    }

    addFriend(user: User) {
        if (user.uuid == this.uuid) {
            throw new Error("You cannot add yourself as a friend");
        }

        if (this.uuidFriendList.includes(user.uuid)) {
            return;
        }

        this.uuidFriendList.push(user.uuid);
    }

}

