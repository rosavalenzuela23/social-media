import type Profile from "@/models/profile";
import axios from "axios";
import { injectable } from "inversify";

@injectable()
export default class ProfileService {
  private static instance: ProfileService;

  profile: Profile | null = null;

  static getInstance(): ProfileService {
    if (!this.instance) {
      this.instance = new ProfileService();
    }
    return this.instance;
  }

  async getMyProfile(update: boolean = false): Promise<Profile> {
    if (this.profile && !update) return this.profile;
    try {
      const res = await axios.get<Profile>(`/api/profiles/me`, {
        withCredentials: true,
      });
      this.profile = res.data;
      return this.profile;
    } catch (err) {
      console.log(err);
      throw err;
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
