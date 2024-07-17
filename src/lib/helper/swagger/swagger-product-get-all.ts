export const swaggerProductGetAll = {
  schema: {
    summary: "Get Product",
    description: "This method returns all products",
    tags: ["product"],
    params: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "number of page",
        },
        limit: {
          type: "number",
          description: "number of limit",
        },
      },
    },

    response: {
      201: {
        description: "Successful response",
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
    },

    default: {
      description: "Default response",
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    },
  },
};
