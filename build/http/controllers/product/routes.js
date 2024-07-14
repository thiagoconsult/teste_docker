"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/product/routes.ts
var routes_exports = {};
__export(routes_exports, {
  productRoutes: () => productRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3010),
  POSTGRES_HOST: import_zod.z.string(),
  POSTGRES_PORT: import_zod.z.coerce.number(),
  POSTGRES_USER: import_zod.z.string(),
  POSTGRES_PASSWORD: import_zod.z.string(),
  POSTGRES_DB: import_zod.z.string(),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error(`Error environment variables`);
  throw new Error(`Error environment variables`);
}
var env = _env.data;

// src/lib/pg/db.ts
var import_pg = require("pg");
var CONFIG = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  ssl: true
};
var Database = class {
  pool;
  client;
  constructor() {
    this.pool = new import_pg.Pool(CONFIG);
    this.connect();
  }
  async connect() {
    try {
      this.client = await this.pool.connect();
    } catch (error) {
      console.error(`Error starting databa with pg, ${error}`);
    }
  }
  get clientInstance() {
    return this.client;
  }
};
var database = new Database();

// src/repositories/pg/product.repository.ts
var ProductRepository = class {
  async create({ name, price }) {
    const result = await database.clientInstance?.query(
      `
      INSERT INTO product (name, price)
      VALUES ($1, $2) RETURNING *
      `,
      [name, price]
    );
    return result?.rows[0];
  }
  async getAll(page, limit) {
    const offset = (page - 1) * limit;
    const result = await database.clientInstance?.query(
      `
    SELECT * FROM product
    LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );
    return result?.rows || [];
  }
};

// src/use-cases/create-product.ts
var CreateProductUseCase = class {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }
  async handler(product) {
    return this.productRepository.create(product);
  }
};

// src/use-cases/factory/make-create-product.ts
function makeCreateProductUseCase() {
  const productRepository = new ProductRepository();
  const createProductUseCase = new CreateProductUseCase(productRepository);
  return createProductUseCase;
}

// src/http/controllers/product/create.ts
var import_zod2 = require("zod");
async function create(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    price: import_zod2.z.coerce.number()
  });
  const { name, price } = registerBodySchema.parse(request.body);
  const createProductUseCase = makeCreateProductUseCase();
  const product = await createProductUseCase.handler({ name, price });
  return reply.status(201).send(product);
}

// src/use-cases/get-all-product.ts
var GetAllProductUseCase = class {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }
  async handler(page, limit) {
    return this.productRepository.getAll(page, limit);
  }
};

// src/use-cases/factory/make-get-all-product.ts
function makeGetAllProductUseCase() {
  const productRepository = new ProductRepository();
  const getAllProductUseCase = new GetAllProductUseCase(productRepository);
  return getAllProductUseCase;
}

// src/http/controllers/product/get-all.ts
var import_zod3 = require("zod");
async function getAll(request, reply) {
  const registerQuerySchema = import_zod3.z.object({
    page: import_zod3.z.coerce.number().default(1),
    limit: import_zod3.z.coerce.number().default(10)
  });
  const { page, limit } = registerQuerySchema.parse(request.query);
  const getAllProductUseCase = makeGetAllProductUseCase();
  const productList = await getAllProductUseCase.handler(page, limit);
  return reply.status(200).send(productList);
}

// src/http/middlewares/jwt-validate.ts
async function jwtValidade(request, reply) {
  try {
    const routeFreeList = ["POST-/user", "POST-/signin"];
    const validateList = `${request.method}-${request.routeOptions.url}`;
    if (routeFreeList.includes(validateList)) return;
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send("Unauthorized");
  }
}

// src/http/controllers/product/routes.ts
async function productRoutes(app) {
  app.get("/product", getAll);
  app.post("/product", { onRequest: [jwtValidade] }, create);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  productRoutes
});