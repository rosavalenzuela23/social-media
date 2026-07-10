const createProfileSchema = {
	type: "object",
	required: ["name", "interests"],
	properties: {
		name: {
			type: "string",
			minLength: 2,
			maxLength: 20,
		},
		interests: {
			type: "array",
			minItems: 1,
			items: {
				type: "string",
			},
		},
		biography: {
			type: "string",
			maxLength: 160,
			nullable: true,
		},
		image: {
			type: "string",
			nullable: true,
		},
	},
	additionalProperties: false,
	nullable: false,
};

export default createProfileSchema;
