import { NotFoundError } from "../errors/index.js";

export function createTaskService({ taskRepository }) {
  const createTask = async (data) => {
    return await taskRepository.createTask(data);
  };

  const getTasks = async ({ status, priority, page, limit }) => {
    let taskList = await taskRepository.findAllTasks();

    if (status) {
      taskList = taskList.filter((task) => task.status === status);
    }

    if (priority) {
      taskList = taskList.filter((task) => task.priority === priority);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = taskList.slice(startIndex, endIndex);

    return {
      data: paginatedTasks,
      total: paginatedTasks.length,
      page,
      limit,
    };
  };

  const getTask = async (id) => {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError(`Task with id ${id} does not exist`);
    }

    return task;
  };

  const updateTask = async (id, data) => {
    const updatedTask = await taskRepository.updateTask(id, data);

    if (!updatedTask) {
      throw new NotFoundError(`Task with id ${id} does not exist`);
    }

    return updatedTask;
  };

  const deleteTask = async (id) => {
    const deleted = await taskRepository.deleteTask(id);

    if (!deleted) {
      throw new NotFoundError(`Task with id ${id} does not exist`);
    }

    return true;
  };

  return {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
  };
}
