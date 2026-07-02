import axios from "axios";
import { injectable } from "inversify";

@injectable()
export default class PostService {
  private static instance: PostService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PostService();
    }
    return this.instance;
  }

  async getPosts() {
    try {
      const res = await axios.get(`/api/posts/feed?page=0&size=10`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  async createPost(content: string) {
    try {
      const res = await axios.post(
        `/api/posts/`,
        {
          content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
}
