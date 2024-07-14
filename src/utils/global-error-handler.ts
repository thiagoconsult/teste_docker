import { jwtValidade } from "@/http/middlewares/jwt-validate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { DatabaseError } from "pg";
import { ZodError } from "zod";

export function globalErrorHandler(
  error: Error,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: "Validation error", errors: error.format() });
  }

  if (error instanceof DatabaseError) {
    reply
      .status(400)
      .send({ message: "Database integrity error", errors: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    reply.status(401).send({ error: error.message });
  }

  return reply.status(500).send("Internal server error");
}
