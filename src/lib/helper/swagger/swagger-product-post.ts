export const swaggerProductPost = {
  summary: "POST Product",
  description: "This method uncludes a new product",
  tags: ["product"],
  params: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "name of product",
      },
      price: {
        type: "number",
        description: "price of product",
      },
    },
  },

  response: {
    201: {
      description: "Successful response",
      type: "object",
      properties: {
        message: {
          id: "d9722cb7-f439-466b-92ca-3a5ea83453f4",
          name: "boneca",
          price: 109.9,
        },
      },
    },
  },

  default: {
    description: "Default response",
    type: "object",
    properties: {
      message: {
        id: "d9722cb7-f439-466b-92ca-3a5ea83453f4",
        name: "boneca",
        price: 109.9,
      },
    },
  },
};
