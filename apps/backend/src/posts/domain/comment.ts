export default class Comment {
	constructor(
		public uuid: string,
		public message: string,
		public date: Date,
		public creatorUuid: string,
		public creatorUsername: string,
		public postUuid: string,
	) {}
}

export class CommentBuilder {
	private uuid?: string;
	private message?: string;
	private date: Date = new Date();
	private creatorUuid?: string;
	private creatorUsername?: string;
	private postUuid?: string;

	public setUuid(uuid: string): CommentBuilder {
		this.uuid = uuid;
		return this;
	}

	public setMessage(message: string): CommentBuilder {
		this.message = message;
		return this;
	}

	public setDate(date: Date): CommentBuilder {
		this.date = date;
		return this;
	}

	public setCreator(uuid: string, username: string): CommentBuilder {
		this.creatorUuid = uuid;
		this.creatorUsername = username;
		return this;
	}

	public setPostUuid(uuid: string): CommentBuilder {
		this.postUuid = uuid;
		return this;
	}

	public build(): Comment {
		if (!this.message || !this.creatorUuid || !this.creatorUsername || !this.postUuid) {
			throw new Error(
				"Required fields are missing: uuid, message, creatorUuid, creatorUsername, postUuid",
			);
		}

		return new Comment(
			this.uuid,
			this.message,
			this.date,
			this.creatorUuid,
			this.creatorUsername,
			this.postUuid,
		);
	}
}
