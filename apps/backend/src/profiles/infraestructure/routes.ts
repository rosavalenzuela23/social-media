import type { FastifyInstance } from "fastify";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";
import createProfileSchema from "./schemas/create-profile.schema.js";
import { container } from "./di.js";
import ProfileController from "./handlers/profile.handler.js";
import setProfilePictureSchema from "./schemas/set-profile-picture.schema.js";
import { getProfilePictureSchema } from "./schemas/get-profile-picture.schema.js";
import { updateProfileSchema } from "./schemas/update-profile.schema.js";

const controller = container.resolve(ProfileController);

async function routes(fastify: FastifyInstance) {
	const defaultRoute = "/api/profiles";
	const adminRoute = "/api/admin/profiles";
	fastify.addHook("preHandler", requireAuth);
	fastify.post(
		defaultRoute + "/me",
		{ schema: { body: createProfileSchema } },
		controller.createProfile.bind(controller),
	);
	fastify.get(defaultRoute + "/me", controller.getOwnUserInformation.bind(controller));
	fastify.get(defaultRoute + "/:profileId", controller.getProfileWithId.bind(controller));
	fastify.get(
		defaultRoute + "/:profileId/picture",
		{ schema: getProfilePictureSchema },
		controller.getProfilePicture.bind(controller),
	);
	fastify.put(
		defaultRoute + "/me",
		{ schema: updateProfileSchema },
		controller.updateProfile.bind(controller),
	);
	fastify.post(
		defaultRoute + "/me/picture",
		{
			schema: setProfilePictureSchema,
		},
		controller.setProfileImage.bind(controller),
	);
	fastify.get(adminRoute + "/", controller.getAllProfiles.bind(controller));
}

export default routes;
