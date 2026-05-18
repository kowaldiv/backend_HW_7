export function createTaskController({ taskService }) {
  const create = async (request, reply) => {
    const { title, description, status, priority } = request.body;

    const task = await taskService.createTask({
      title,
      description,
      status,
      priority,
    });

    return reply.status(201).send(task);
  };

  const getAll = async (request, reply) => {
    const { status, priority, page, limit } = request.query;

    const tasks = await taskService.getTasks({ status, priority, page, limit });

    return reply.status(201).send(tasks);
  };

  const getById = async (request, reply) => {
    const { id } = request.params;

    const task = await taskService.getTask(id);

    return reply.status(201).send(task);
  };

  const update = async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const updatedTask = await taskService.updateTask(id, updates);

    return reply.status(201).send(updatedTask);
  };

  const remove = async (request, reply) => {
    const { id } = request.params;

    const task = await taskService.deleteTask(id);

    return reply
      .status(201)
      .send({ message: `Task with id ${id} has been deleted` });
  };

  return {
    create,
    getAll,
    getById,
    update,
    remove,
  };
}
