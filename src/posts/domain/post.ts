import Image from "./image.js";

export default class Post {
    constructor(public creatorUuid: string, public message: string, public date: Date, public comments?: Post[], public images?: Image[]) {
    }

}