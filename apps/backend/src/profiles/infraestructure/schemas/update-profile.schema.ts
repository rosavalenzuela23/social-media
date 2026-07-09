import { LikeTextEnum } from "@/profiles/domain/like.enum.js";

export const updateProfileSchema = {
	body: {
		type: "object",
		properties: {
			bio: { type: "object" },
			likeText: {
				type: "object",
			},
			image: { type: "object" },
		},
		minProperties: 1,
		additionalProperties: false,
	},
};
