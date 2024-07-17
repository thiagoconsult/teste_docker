import fastify from "fastify";
import { userRoutes } from "./http/controllers/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";
import { productRoutes } from "./http/controllers/product/routes";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import swagger from "@fastify/swagger";
import swaggetUi from "@fastify/swagger-ui";

export const app = fastify({ logger: true });

app.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
  },
});

app.register(swaggetUi, {
  routePrefix: "/doc",
});

// app.ready();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: "1d" },
});

app.register(userRoutes);
app.register(productRoutes);

app.setErrorHandler(globalErrorHandler);
