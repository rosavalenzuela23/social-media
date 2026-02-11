const createProfileSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 20,
    },
  },
  additionalProperties: false,
  nullable: false,
};

export default createProfileSchema;
