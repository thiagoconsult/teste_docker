import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeSigninUseCase } from "@/use-cases/factory/make-signin";
import { SigninUseCase } from "@/use-cases/signin";
import { compare } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const { username, password } = registerBodySchema.parse(request.body);

  const signinUseCase = makeSigninUseCase();
  const user = await signinUseCase.handler(username);

  if (!user) throw new InvalidCredentialsError();

  const doesPasswordMatch = await compare(password, user.password);

  if (!doesPasswordMatch) throw new InvalidCredentialsError();

  const token = await reply.jwtSign({ username });

  return reply.status(200).send({ token: token });
}
