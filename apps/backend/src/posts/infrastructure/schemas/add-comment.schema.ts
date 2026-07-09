const addCommentSchema = {
	params: {
		type: "object",
		properties: {
			postId: { type: "string" },
		},
		required: ["postId"],
	},
	body: {
		type: "object",
		properties: {
			content: { type: "string" },
		},
		required: ["content"],
	},
};

export default addCommentSchema;
