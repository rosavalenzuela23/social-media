import type { FastifyInstance } from "fastify";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";
import createProfileSchema from "./schemas/create-profile.schema.js";
import { container } from "./di.js";
import ProfileController from "./handlers/profile.handler.js";
import setProfilePictureSchema from "./schemas/set-profile-picture.schema.js";
import { getProfilePictureSchema } from "./schemas/get-profile-picture.schema.js";

const controller = container.resolve(ProfileController);

async function routes(fastify: FastifyInstance) {
	const defaultRoute = "/api/profiles";
	const adminRoute = "/api/admin/profiles";
	fastify.post(
		defaultRoute + "/me",
		{ schema: { body: createProfileSchema } },
		controller.createProfile.bind(controller),
	);
	fastify.get(
		defaultRoute + "/me",
		{ preHandler: [requireAuth] },
		controller.getOwnUserInformation.bind(controller),
	);
	fastify.get(
		defaultRoute + "/:profileId",
		{ preHandler: [requireAuth] },
		controller.getProfileWithId.bind(controller),
	);
	fastify.get(
		defaultRoute + "/:profileId/picture",
		{ schema: getProfilePictureSchema },
		controller.getProfilePicture.bind(controller),
	);
	fastify.post(
		defaultRoute + "/me/picture",
		{
			schema: setProfilePictureSchema,
		},
		controller.setProfileImage.bind(controller),
	);
	fastify.get(
		adminRoute + "/",
		{ preHandler: [requireAuth] },
		controller.getAllProfiles.bind(controller),
	);
}

export default routes;
