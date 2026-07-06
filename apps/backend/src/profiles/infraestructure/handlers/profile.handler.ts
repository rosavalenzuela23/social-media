import ProfileService from "@/profiles/application/profile.service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import ProfileMapper from "../persistance/mappers/profile.mapper.js";

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
			};
		}>,
		reply: FastifyReply,
	) {
		const name = request.body.name;
		const userUuid = request.session.user.uuid;
		const username = request.session.user.username;

		try {
			return await this.profileService.createProfile({
				name,
				username,
				uuid: userUuid,
			});
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

	async getAllProfiles() {
		return await this.profileService.getAllProfiles();
	}
}
