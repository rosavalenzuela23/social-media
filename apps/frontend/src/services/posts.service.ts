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
      const res = await axios.get(`/api/posts/user?uuid=${uuid}&page=0&size=10`, {
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

  async getFeed() {
    try {
      const res = await axios.get(`/api/posts/feed?page=0&size=10`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
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
