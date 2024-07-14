import { makeGetAllProductUseCase } from "@/use-cases/factory/make-get-all-product";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const registerQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  });

  const { page, limit } = registerQuerySchema.parse(request.query);

  const getAllProductUseCase = makeGetAllProductUseCase();
  const productList = await getAllProductUseCase.handler(page, limit);

  return reply.status(200).send(productList);
}
