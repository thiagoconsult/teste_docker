import { FastifyReply, FastifyRequest } from "fastify";

export async function jwtValidade(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const routeFreeList = ["POST-/user", "POST-/signin"];
    const validateList = `${request.method}-${request.routeOptions.url}`;

    if (routeFreeList.includes(validateList)) return;

    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send("Unauthorized");
  }
}
