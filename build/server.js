"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));

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

// src/repositories/pg/user.repository.ts
var UserRepository = class {
  async create({ username, password }) {
    const result = await database.clientInstance?.query(
      `
      INSERT INTO "user" (username, password)
      VALUES ($1, $2) RETURNING *
      `,
      [username, password]
    );
    return result?.rows[0];
  }
  async signin(username) {
    const result = await database.clientInstance?.query(
      `
      SELECT * FROM "user"
      WHERE username = $1
      `,
      [username]
    );
    return result?.rows[0];
  }
};

// src/use-cases/create-user.ts
var CreateUserUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async handler(user) {
    return this.userRepository.create(user);
  }
};

// src/use-cases/factory/make-create-user.ts
function makeCreateUserUseCase() {
  const userRepository = new UserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return createUserUseCase;
}

// src/http/controllers/user/create.ts
var import_bcryptjs = require("bcryptjs");
var import_zod2 = require("zod");
async function create(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    username: import_zod2.z.string(),
    password: import_zod2.z.string()
  });
  const { username, password } = registerBodySchema.parse(request.body);
  const passwordHashed = await (0, import_bcryptjs.hash)(password, 8);
  const userWithHashedPassword = { username, password: passwordHashed };
  const createUserUseCase = makeCreateUserUseCase();
  const user = await createUserUseCase.handler(userWithHashedPassword);
  return reply.status(201).send(user);
}

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Username or password is invalid");
  }
};

// src/use-cases/signin.ts
var SigninUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async handler(username) {
    return this.userRepository.signin(username);
  }
};

// src/use-cases/factory/make-signin.ts
function makeSigninUseCase() {
  const userRepository = new UserRepository();
  const signinUseCase = new SigninUseCase(userRepository);
  return signinUseCase;
}

// src/http/controllers/user/signin.ts
var import_bcryptjs2 = require("bcryptjs");
var import_zod3 = require("zod");
async function signin(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    username: import_zod3.z.string(),
    password: import_zod3.z.string()
  });
  const { username, password } = registerBodySchema.parse(request.body);
  const signinUseCase = makeSigninUseCase();
  const user = await signinUseCase.handler(username);
  if (!user) throw new InvalidCredentialsError();
  const doesPasswordMatch = await (0, import_bcryptjs2.compare)(password, user.password);
  if (!doesPasswordMatch) throw new InvalidCredentialsError();
  const token = await reply.jwtSign({ username });
  return reply.status(200).send({ token });
}

// src/http/controllers/user/routes.ts
async function userRoutes(app2) {
  app2.post("/user", create);
  app2.post("/user/signin", signin);
}

// src/utils/global-error-handler.ts
var import_pg2 = require("pg");
var import_zod4 = require("zod");
function globalErrorHandler(error, _, reply) {
  if (error instanceof import_zod4.ZodError) {
    reply.status(400).send({ message: "Validation error", errors: error.format() });
  }
  if (error instanceof import_pg2.DatabaseError) {
    reply.status(400).send({ message: "Database integrity error", errors: error.message });
  }
  if (error instanceof InvalidCredentialsError) {
    reply.status(401).send({ error: error.message });
  }
  return reply.status(500).send("Internal server error");
}

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
var import_zod5 = require("zod");
async function create2(request, reply) {
  const registerBodySchema = import_zod5.z.object({
    name: import_zod5.z.string(),
    price: import_zod5.z.coerce.number()
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
var import_zod6 = require("zod");
async function getAll(request, reply) {
  const registerQuerySchema = import_zod6.z.object({
    page: import_zod6.z.coerce.number().default(1),
    limit: import_zod6.z.coerce.number().default(10)
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
async function productRoutes(app2) {
  app2.get("/product", getAll);
  app2.post("/product", { onRequest: [jwtValidade] }, create2);
}

// src/app.ts
var import_jwt = __toESM(require("@fastify/jwt"));
var app = (0, import_fastify.default)({ logger: true });
app.register(import_jwt.default, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: "1d" }
});
app.register(userRoutes);
app.register(productRoutes);
app.setErrorHandler(globalErrorHandler);

// src/server.ts
app.listen({
  host: "localhost",
  port: env.PORT
}).then(() => console.log(`Server started on port #${env.PORT}`));
