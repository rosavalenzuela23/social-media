const getProfilePictureSchema = {
	params: {
		type: "object",
		required: ["profileId"],
		properties: {
			profileId: {
				type: "string",
			},
		},
	},
};

export { getProfilePictureSchema };
