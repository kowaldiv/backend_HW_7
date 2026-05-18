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

const tasks = new Map();

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
  if (error.name === "ValidationError") {
    return reply.status(error.statusCode).send({
      error: error.message,
      ...(error.errors && { details: error.errors }),
    });
  }

  request.log.error(error);
  return reply.status(500).send({ error: "Server error" });
});

app.get("/", async () => {
  return { message: "i am started" };
});

app.post(
  "/tasks",
  { preHandler: app.validate({ body: createTaskSchema }) },
  async (request, reply) => {
    const { title, description, status, priority } = request.body;

    const now = new Date();
    const id = +now;
    const newTask = {
      id: id.toString(),
      title,
      description,
      status,
      priority,
      createdAt: now,
      updatedAt: now,
    };
    tasks.set(id.toString(), newTask);

    return reply.status(201).send(newTask);
  },
);

app.get(
  "/tasks",
  { preHandler: app.validate({ query: taskQuerySchema }) },
  async (request, reply) => {
    const { status, priority, page, limit } = request.query;
    let taskList = Array.from(tasks.values());

    if (status) {
      taskList = taskList.filter((task) => task.status === status);
    }

    if (priority) {
      taskList = taskList.filter((task) => task.priority === priority);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = taskList.slice(startIndex, endIndex);

    return reply.status(200).send({
      data: paginatedTasks,
      total: paginatedTasks.length,
      page: page,
      limit: limit,
    });
  },
);

app.get(
  "/tasks/:id",
  { preHandler: app.validate({ params: taskParamsSchema }) },
  async (request, reply) => {
    const { id } = request.params;
    const task = tasks.get(id);

    if (!task) {
      return reply.status(404).send({
        error: "Not Found",
        message: `Task with id ${id} does not exist`,
      });
    }

    return reply.status(200).send({ data: task });
  },
);

app.patch(
  "/tasks/:id",
  {
    preHandler: [
      app.validate({ params: taskParamsSchema }),
      app.validate({ body: updateTaskSchema }),
    ],
  },
  async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const existingTask = tasks.get(id);

    if (!existingTask) {
      return reply.status(404).send({
        error: "Not Found",
        message: `Task with id ${id} does not exist`,
      });
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };

    tasks.set(id, updatedTask);

    return reply.status(200).send({ data: updatedTask });
  },
);

app.delete(
  "/tasks/:id",
  {
    preHandler: [app.validate({ params: taskParamsSchema })],
  },
  async (request, reply) => {
    const { id } = request.params;

    const existingTask = tasks.get(id);

    if (!existingTask) {
      return reply.status(404).send({
        error: "Not Found",
        message: `Task with id ${id} does not exist`,
      });
    }

    tasks.delete(id);

    return reply
      .status(200)
      .send({ message: `Task with id ${id} has been deleted` });
  },
);

app.listen({ port: 3000 });
