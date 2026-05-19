import fs from "fs/promises";

export function createTaskFileRepository({ filePath }) {
  const readTasks = async () => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const tasks = JSON.parse(data);

      const tasksMap = new Map();
      tasks.forEach((task) => {
        task.createdAt = new Date(task.createdAt);
        task.updatedAt = new Date(task.updatedAt);
        tasksMap.set(task.id, task);
      });
      return tasksMap;
    } catch (err) {
      if (err.code === "ENOENT") {
        return new Map();
      }
      throw err;
    }
  };

  const writeTasks = async (tasksMap) => {
    const tasksArray = Array.from(tasksMap.values());
    await fs.writeFile(filePath, JSON.stringify(tasksArray, null, 2));
  };

  const findAllTasks = async () => {
    const tasksMap = await readTasks();
    return Array.from(tasksMap.values());
  };

  const findById = async (id) => {
    const tasksMap = await readTasks();
    return tasksMap.get(id) || null;
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

    const tasksMap = await readTasks();
    tasksMap.set(id.toString(), newTask);
    await writeTasks(tasksMap);

    return newTask;
  };

  const updateTask = async (id, updates) => {
    const tasksMap = await readTasks();
    const existingTask = tasksMap.get(id);

    if (!existingTask) {
      return null;
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };

    tasksMap.set(id, updatedTask);
    await writeTasks(tasksMap);

    return updatedTask;
  };

  const deleteTask = async (id) => {
    const tasksMap = await readTasks();

    if (!tasksMap.has(id)) {
      return false;
    }

    tasksMap.delete(id);
    await writeTasks(tasksMap);

    return true;
  };

  return {
    findAllTasks,
    findById,
    createTask,
    updateTask,
    deleteTask,
  };
}
