import axios from 'axios';

export default class PostService {
  private static instance: PostService;
  private postsApi: string;

  private constructor() {
    this.postsApi = import.meta.env.VITE_POSTS_API;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new PostService();
    }
    return this.instance;
  }

  async getPosts() {
    try {
      const res = await axios.get(`${this.postsApi}/posts/feed?page=0&size=10`, {
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
        `${this.postsApi}/posts/`,
        {
          content,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
}
