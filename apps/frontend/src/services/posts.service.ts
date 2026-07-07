import axios from "axios";
import { injectable } from "inversify";
import type { Post } from "./dto/post.dto";

@injectable()
export default class PostService {
	private static instance: PostService;

	static getInstance() {
		if (!this.instance) {
			this.instance = new PostService();
		}
		return this.instance;
	}

	async getPostsByUuid(uuid: string) {
		try {
			const res = await axios.get(`/api/posts/users/${uuid}?page=0&size=10`, {
				withCredentials: true,
			});
			return res.data;
		} catch (err) {
			console.log(err);
		}
	}

	async getMyPosts(): Promise<Post[]> {
		try {
			const res = await axios.get<Post[]>(`/api/posts/me/?page=0&size=10`, {
				withCredentials: true,
			});
			return res.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async getFeed(page: number = 0, limit: number = 10) {
		try {
			const res = await axios.get(`/api/posts/feed?page=${page}&size=${limit}`, {
				withCredentials: true,
			});
			return res.data;
		} catch (err) {
			console.log(err);
		}
	}

	async addComment(postId: string, message: string) {
		await axios.post(
			`/api/posts/${postId}/comments`,
			{ content: message },
			{
				withCredentials: true,
			},
		);
	}

	async likeComment(postId: string, commentId: string) {
		await axios.post(`/api/posts/${postId}/comments/${commentId}/like`, undefined, {
			withCredentials: true,
		});
	}

	async likePost(postId: string) {
		const res = await axios.put(`/api/posts/${postId}/like`, undefined, {
			withCredentials: true,
		});
		return res.data;
	}

	async createPost(content: string, images?: any) {
		const data: { content: string; images?: any } = {
			content,
		};

		if (images) {
			data.images = images;
		}

		try {
			const res = await axios.post(`/api/posts/`, data, {
				withCredentials: true,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		} catch (err) {
			console.log(err);
		}
	}
}
