import type { FastifyReply } from "fastify";
import { ZodError } from "zod";

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return reply.status(statusCode).send(
    details === undefined ? { code, message } : { code, message, details },
  );
}

export function handleRouteError(reply: FastifyReply, error: unknown) {
  if (error instanceof ZodError) {
    return sendError(reply, 400, "VALIDATION_ERROR", "Dados invalidos.", error.flatten());
  }

  if (error instanceof Error) {
    return sendError(reply, 500, "INTERNAL", error.message);
  }

  return sendError(reply, 500, "INTERNAL", "Erro interno inesperado.");
}
