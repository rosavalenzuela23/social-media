const createPostSchema = {
    type: "object",
    required: ['content'],
    properties: {
        content: {
            type: "string",
            minLength: 1
        }
    },
    additionalProperties: false,
    nullable: false
}

export default { body: createPostSchema };