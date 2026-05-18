export function createTaskRepository() {
  const tasks = new Map();

  const findAllTasks = async () => {
    const taskList = Array.from(tasks.values());

    return taskList;
  };

  const findById = async (id) => {
    const task = tasks.get(id);

    if (!task) {
      return null;
    }

    return task;
  };

  const createTask = async ({ title, description, status, priority }) => {
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

    return newTask;
  };

  const updateTask = async (id, updates) => {
    const existingTask = tasks.get(id);

    if (!existingTask) {
      return null;
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };

    tasks.set(id, updatedTask);

    return updatedTask;
  };

  const deleteTask = async (id) => {
    const existingTask = tasks.get(id);

    if (!existingTask) {
      return null;
    }

    tasks.delete(id);

    return `Task with id ${id} has been deleted`;
  };

  return {
    findAllTasks,
    findById,
    createTask,
    updateTask,
    deleteTask,
  };
}
