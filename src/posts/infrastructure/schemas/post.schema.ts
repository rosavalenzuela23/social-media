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
            type: "string",
            minLength: 1
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
    additionalProperties: false,
    nullable: false
}

export default { body: createPostSchema };