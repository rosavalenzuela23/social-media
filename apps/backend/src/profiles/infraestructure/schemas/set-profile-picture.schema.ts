const setProfilePictureSchema = {
	body: {
		type: "object",
		required: ["image"],
		properties: {
			image: {
				type: "object",
			},
		},
	},
	additionalProperties: false,
};

export default setProfilePictureSchema;
