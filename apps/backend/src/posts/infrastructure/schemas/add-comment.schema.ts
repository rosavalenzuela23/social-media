const addCommentSchema = {
	querystring: {
		type: "object",
		properties: {
			postUuid: { type: "string" },
		},
		required: ["postUuid"],
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
