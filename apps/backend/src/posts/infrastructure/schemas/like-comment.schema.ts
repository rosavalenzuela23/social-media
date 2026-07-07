const likeCommentSchema = {
	params: {
		type: "object",
		properties: {
			postId: { type: "string" },
			commentId: { type: "string" },
		},
		required: ["postId", "commentId"],
	},
};

export default likeCommentSchema;
