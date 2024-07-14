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

// src/http/controllers/product/get-all.ts
var get_all_exports = {};
__export(get_all_exports, {
  getAll: () => getAll
});
module.exports = __toCommonJS(get_all_exports);

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
var import_zod2 = require("zod");
async function getAll(request, reply) {
  const registerQuerySchema = import_zod2.z.object({
    page: import_zod2.z.coerce.number().default(1),
    limit: import_zod2.z.coerce.number().default(10)
  });
  const { page, limit } = registerQuerySchema.parse(request.query);
  const getAllProductUseCase = makeGetAllProductUseCase();
  const productList = await getAllProductUseCase.handler(page, limit);
  return reply.status(200).send(productList);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAll
});