import { FastifyInstance } from "fastify";
import { create } from "./create";
import { getAll } from "./get-all";
import { jwtValidade } from "@/http/middlewares/jwt-validate";
import { swaggerProductGetAll } from "@/lib/helper/swagger/swagger-product-get-all";
import { swaggerProductPost } from "@/lib/helper/swagger/swagger-product-post";

export async function productRoutes(app: FastifyInstance) {
  app.get("/product", swaggerProductGetAll, getAll);
  app.post(
    "/product",
    { schema: swaggerProductPost, onRequest: [jwtValidade] },
    create
  );
}
