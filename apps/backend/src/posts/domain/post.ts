import type Comment from "./comment.js";
import Image from "./image.js";
import type Like from "./like.js";

export default class Post {
	constructor(
		public creatorUuid: string,
		public creatorUsername: string,
		public message: string,
		public date: Date,
		public userUuidExcludeList: string[],
		public images: Image[] = [],
		public comments?: Comment[],
		public uuid?: string,
		public likes?: Like[],
    public categories?: Category[]
	) {}
}

enum Category {
Cat,
Dog,
Snake,
Other
}

export class PostBuilder {
	private creatorUuid?: string;
	private creatorUsername?: string;
	private message?: string;
	private date: Date = new Date();
	private userUuidExcludeList: string[] = [];
	private images: Image[] = [];
	private comments: Comment[] = [];
	private uuid?: string;
	private likes: Like[] = [];
  private categories: Category[];

	public setCreator(uuid: string, username: string): PostBuilder {
		this.creatorUuid = uuid;
		this.creatorUsername = username;
		return this;
	}

	public setMessage(message: string): PostBuilder {
		this.message = message;
		return this;
	}

	public setDate(date: Date): PostBuilder {
		this.date = date;
		return this;
	}

	public setExcludeList(list: string[]): PostBuilder {
		this.userUuidExcludeList = list;
		return this;
	}

	public addImage(image: Image): PostBuilder {
		this.images.push(image);
		return this;
	}

	public addImages(images: Image[]): PostBuilder {
		this.images = [...this.images, ...images];
		return this;
	}

	public setComments(comments: Comment[]): PostBuilder {
		this.comments = comments;
		return this;
	}

	public setUuid(uuid: string) {
		this.uuid = uuid;
		return this;
	}

	public setLikes(likes: Like[]) {
		this.likes = likes;
		return this;
	}

  	public addCategory(category: Category) {
		this.categories.push(category)
		return this;
	}

	public build(): Post {
		if (!this.creatorUsername || !this.creatorUuid || !this.message) {
			throw new Error("Required fields are missing: creatorUuid, creatorUsername, message");
		}

		return new Post(
			this.creatorUuid,
			this.creatorUsername,
			this.message,
			this.date,
			this.userUuidExcludeList,
			this.images,
			this.comments,
			this.uuid,
			this.likes,
		);
	}
}
