const setLikeSchema = {
	params: {
		type: "object",
		properties: {
			postId: { type: "string", minLength: 1 },
		},
		required: ["postId"],
	},
};

export default setLikeSchema;
