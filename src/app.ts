import fastify from "fastify";
import { userRoutes } from "./http/controllers/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";
import { productRoutes } from "./http/controllers/product/routes";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";

export const app = fastify({ logger: true });

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: "1d" },
});

app.register(userRoutes);
app.register(productRoutes);

app.setErrorHandler(globalErrorHandler);
