const getPostsPageSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "number", minimum: 0 },
      size: { type: "number", minimum: 1, maximum: 50 },
    },
    required: ["page", "size"],
  },
};

export default getPostsPageSchema;
