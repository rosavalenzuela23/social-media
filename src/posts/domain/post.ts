import Image from "./image.js";

export default class Post {

    constructor(
        public creatorUuid: string,
        public creatorUsername: string,
        public message: string,
        public date: Date,
        public images?: Image[],
        public comments?: Post[]
    ) { }

} 