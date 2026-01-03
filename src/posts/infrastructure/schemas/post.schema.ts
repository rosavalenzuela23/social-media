const fileSchema = {
    type: "object",
    required: ['mimetype', 'filename'],
    properties: {
        mimetype: {
            type: "string",
            enum: ['image/jpeg', 'image/png']
        },
        filename: {
            type: "string",
            minLength: 1
        }
    }
}

const createPostSchema = {
    type: "object",
    required: ['content'],
    properties: {
        content: {
            type: "object",
        },
        images: {
            anyOf: [
                {
                    type: "array",
                    items: fileSchema
                },
                fileSchema
            ]
        }
    },
    additionalProperties: true,
    nullable: false
}

export default { body: createPostSchema };