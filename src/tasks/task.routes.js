import {
  createTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../schemas/task.schema.js";

export function registerTaskRoutes(app, taskController) {
  app.post(
    "/tasks",
    { preHandler: app.validate({ body: createTaskSchema }) },
    taskController.create,
  );

  app.get(
    "/tasks",
    { preHandler: app.validate({ query: taskQuerySchema }) },
    taskController.getAll,
  );

  app.get(
    "/tasks/:id",
    { preHandler: app.validate({ params: taskParamsSchema }) },
    taskController.getById,
  );

  app.patch(
    "/tasks/:id",
    {
      preHandler: [
        app.validate({ params: taskParamsSchema }),
        app.validate({ body: updateTaskSchema }),
      ],
    },
    taskController.update,
  );

  app.delete(
    "/tasks/:id",
    { preHandler: [app.validate({ params: taskParamsSchema })] },
    taskController.remove,
  );
}
