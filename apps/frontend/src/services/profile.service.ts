import axios from 'axios';

export default class ProfileService {
  private static instance: ProfileService;
  private profilesApi: string;

  private constructor() {
    this.profilesApi = import.meta.env.VITE_PROFILES_API;
  }

  static getInstance(): ProfileService {
    if (!this.instance) {
      this.instance = new ProfileService();
    }
    return this.instance;
  }

  async getMyProfile() {
    try {
      const res = await axios.get(`${this.profilesApi}/profiles/me`, {
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
        `${this.profilesApi}/profiles/me`,
        {
          name: profileName,
        },
        {
          withCredentials: true,
        },
      );
    } catch {
      console.log('');
    }
  }
}
