import axios from "axios";
import { injectable } from "inversify";

@injectable()
export default class ProfileService {
  private static instance: ProfileService;

  static getInstance(): ProfileService {
    if (!this.instance) {
      this.instance = new ProfileService();
    }
    return this.instance;
  }

  async getMyProfile() {
    try {
      const res = await axios.get(`/api/profiles/me`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  async createProfile(profileName: string) {
    try {
      await axios.post(
        `/api/profiles/me`,
        {
          name: profileName,
        },
        {
          withCredentials: true,
        },
      );
    } catch {
      console.log("");
    }
  }
}
