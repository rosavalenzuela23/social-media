import axios from 'axios';
import type { UserRegisteredDto } from './dto/register.dto';

export default class AuthService {
  private static instance: AuthService;
  private authApi: string;

  private constructor() {
    this.authApi = import.meta.env.VITE_AUTH_API;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  async getCurrentUser() {}

  async login(username: string, password: string) {
    try {
      const res = await axios.post(`${this.authApi}/users/login/`, {
        username,
        password,
      }, {
        withCredentials: true,
      });

      const message = res.data.message;
      return message;
    } catch (err) {}
  }

  async logout() {}

  async register(opts: { email: string; password: string; username: string }) {
    try {
      const res = await axios.post<UserRegisteredDto>(`${this.authApi}/users/`, {
        username: opts.username,
        email: opts.email,
        password: opts.password,
      });
      const message = res.data.message;
      return message;
    } catch (err) {
      console.log(err);
    }
  }
}
