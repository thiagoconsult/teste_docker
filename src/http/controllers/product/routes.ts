import { FastifyInstance } from "fastify";
import { create } from "./create";
import { getAll } from "./get-all";
import { jwtValidade } from "@/http/middlewares/jwt-validate";

export async function productRoutes(app: FastifyInstance) {
  app.get("/product", getAll);
  app.post("/product", { onRequest: [jwtValidade] }, create);
}
