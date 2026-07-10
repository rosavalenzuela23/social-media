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

	async getMyProfile(update: boolean = true): Promise<Profile> {
		const json = localStorage.getItem("profile_information");

		if (json && !update) return JSON.parse(json);

		try {
			const res = await axios.get<Profile>(`/api/profiles/me`, {
				withCredentials: true,
			});
			this.profile = res.data;

			localStorage.setItem("profile_information", JSON.stringify(this.profile));

			return this.profile;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async createProfile(profileName: string, interests: string[], biography?: string, image?: File) {
		const formdata = {
			name: profileName,
			interests,
		};

		if (biography) {
			formdata.biography = biography;
		}

		if (image) {
			const fileToBase64 = (file) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result);
					reader.onerror = (error) => reject(error);
				});

			const base64Image = await fileToBase64(image);
			formdata.image = base64Image;
		}

		await axios.post(`/api/profiles/me`, formdata, {
			withCredentials: true,
		});
	}

	async updateProfileInfo(formData: FormData) {
		await axios.put("/api/profiles/me", formData, {
			withCredentials: true,
		});
	}

	async getProfile(profileUuid: string): Promise<Profile> {
		try {
			const res = await axios.get<Profile>(`/api/profiles/${profileUuid}`, {
				withCredentials: true,
			});
			return res.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}
