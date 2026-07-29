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

type Comment = {
	uuid: string;
	message: string;
	creatorUuid: string;
	creatorUsername: string;
	postUuid: string;
	likes: Like[];
};

type Post = {
	creatorUsername: string;
	uuid: string;
	creatorUuid: string;
	message: string;
	date: string;
	images: Array<Image>;
	likes: Like[];
	comments?: {
		total: number;
		list: Comment[];
	};
};

export type { Post, Image, Like, Comment };
