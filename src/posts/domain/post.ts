export default class Post {
    constructor(public creator: number, public message: string, public date: Date) {
        this.creator = creator;
        this.date = date || new Date();
        this.message = message;
    }

}