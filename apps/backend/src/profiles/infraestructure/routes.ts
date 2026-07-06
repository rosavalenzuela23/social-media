import type { FastifyInstance } from "fastify";
import { requireAuth } from "@shared/infrastructure/fastify/auth-hook.js";
import createProfileSchema from "./schemas/create-profile.schema.js";
import { container } from "tsyringe";
import PostgresRepository from "./persistance/repositories/postgres.repository.js";
import ProfileController from "./handlers/profile.handler.js";

container.register("ProfileRepository", {
	useValue: new PostgresRepository(),
});

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
		adminRoute + "/",
		{ preHandler: [requireAuth] },
		controller.getAllProfiles.bind(controller),
	);
}

export default routes;
