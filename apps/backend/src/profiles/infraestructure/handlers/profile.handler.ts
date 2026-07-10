import ProfileService from "@/profiles/application/profile.service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type MultipartFile } from "@fastify/multipart";
import { inject, injectable } from "tsyringe";
import ProfileMapper from "../persistance/mappers/profile.mapper.js";
import type { LikeTextEnum } from "@/profiles/domain/like.enum.js";

@injectable()
export default class ProfileController {
	constructor(@inject(ProfileService) private profileService: ProfileService) {}

	async getOwnUserInformation(request: FastifyRequest) {
		const userUuid = request.session.user.uuid;
		return await this.profileService.getProfileByUuid(userUuid);
	}

	async createProfile(
		request: FastifyRequest<{
			Body: {
				name: string;
				interests: string[];
				biography?: string;
				image?: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const name = request.body.name;

		const interests = request.body.interests;
		const biography = request.body.biography;
		const image = request.body.image;

		const userUuid = request.session.user.uuid;
		const username = request.session.user.username;

		try {
			const profile = await this.profileService.createProfile({
				name,
				username,
				uuid: userUuid,
				interests,
				biography,
			});

			if (image) {
				const base64String = image.replace(/^data:[a-zA-Z0-9\/\+\-\.]+;base64,/, "");
				const imageBuffer: Buffer = Buffer.from(base64String, "base64");
				await this.profileService.setProfilePicture(userUuid, imageBuffer);
			}

			return profile;
		} catch (err) {
			reply.status(400);
			return { message: err.message };
		}
	}

	async getProfileWithId(
		request: FastifyRequest<{
			Params: {
				profileId: string;
			};
		}>,
	) {
		const profile = await this.profileService.getProfileByUuid(request.params.profileId);
		if (!profile) {
			throw new Error("Profile not found");
		}
		return ProfileMapper.toDto(profile);
	}

	async getProfilePicture(
		request: FastifyRequest<{
			Params: {
				profileId: string;
			};
		}>,
		reply: FastifyReply,
	) {
		try {
			let userId: string;

			if (request.params.profileId == "me") {
				userId = request.session.user.uuid;
			} else {
				userId = request.params.profileId;
			}

			const stream = this.profileService.getProfilePictureStream(userId);
			reply.type("image/webp");
			return stream;
		} catch (err) {
			reply.status(404);
			return { message: "Profile picture not found" };
		}
	}

	async setProfileImage(
		request: FastifyRequest<{
			Body: {
				image: MultipartFile;
			};
		}>,
		reply: FastifyReply,
	) {
		try {
			const fileBuffer: Buffer = await request.body.image.toBuffer();
			await this.profileService.setProfilePicture(request.session.user.uuid, fileBuffer);

			return {
				message: "Profile picture updated successfully",
			};
		} catch (err) {
			reply.status(400);
			return { message: err.message };
		}
	}

	async updateProfile(
		request: FastifyRequest<{
			Body: {
				bio?: { value?: string };
				likeText?: { value?: LikeTextEnum };
				image?: MultipartFile;
			};
		}>,
	) {
		const { bio, likeText, image } = request.body;
		const userUuid = request.session.user.uuid;

		if (bio?.value || likeText?.value) {
			await this.profileService.updateProfileInfo(userUuid, {
				bio: bio?.value,
				likeText: likeText?.value,
			});
		}

		if (image) {
			const fileBuffer: Buffer = await image.toBuffer();
			await this.profileService.setProfilePicture(userUuid, fileBuffer);
		}
	}

	async getAllProfiles() {
		return await this.profileService.getAllProfiles();
	}
}
