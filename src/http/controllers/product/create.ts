import { makeCreateProductUseCase } from "@/use-cases/factory/make-create-product";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
  });

  const { name, price } = registerBodySchema.parse(request.body);

  const createProductUseCase = makeCreateProductUseCase();
  const product = await createProductUseCase.handler({ name, price });

  return reply.status(201).send(product);
}
