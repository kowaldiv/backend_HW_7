import "dotenv/config";
import cors from "@fastify/cors";
import fastify from "fastify";
import zodValidatorPlugin from "./plugins/zod-validator.js";
import {
  createTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "./schemas/task.schema.js";

import { NotFoundError, ValidationError } from "./errors/index.js";

import { createTaskRepository } from "./tasks/task.repository.js";
import { createTaskService } from "./tasks/task.service.js";
import { createTaskController } from "./tasks/task.controller.js";
import { registerTaskRoutes } from "./tasks/task.routes.js";

const repository = createTaskRepository();
const taskService = createTaskService({ taskRepository: repository });
const taskController = createTaskController({ taskService });

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

await app.register(zodValidatorPlugin);
app.register(cors, { origin: process.env.CORS_ORIGIN || "*" });

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      ...(error.errors && { details: error.errors }),
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(error.statusCode).send({
      error: error.message,
    });
  }

  request.log.error(error);
  return reply.status(500).send({ error: "Server error" });
});

app.get("/", async () => {
  return { message: "i am started" };
});

registerTaskRoutes(app, taskController);

app.listen({ port: 3000 });
