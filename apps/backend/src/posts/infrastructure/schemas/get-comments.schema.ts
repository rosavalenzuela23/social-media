const getCommentsSchema = {
	params: {
		type: "object",
		properties: {
			postId: { type: "string" },
		},
		required: ["postId"],
	},
};

export default getCommentsSchema;
