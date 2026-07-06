type Image = {
	path: string;
	uuid: string;
};

type Like = {
	userUuid: string;
	username: string;
	postId: string;
	createdAt: Date;
};

type Post = {
	creatorUsername: string;
	uuid: string;
	creatorUuid: string;
	message: string;
	date: string;
	images: Array<Image>;
	likes: Like[];
};

export type { Post, Image, Like };
