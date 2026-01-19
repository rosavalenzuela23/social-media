const loginInfoSchema = {
    body: {
        type: "object",
            required: ['username', 'password'],
            properties: {
                username: {
                    type: "string",
                    minLength: 3
                },
                password: {
                    type: "string",
                    minLength: 8
                }
            },
            additionalProperties: false,
            nullable: false
    }
};

export default loginInfoSchema;