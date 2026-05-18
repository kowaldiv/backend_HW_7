import z from "zod";

const taskBaseSchema = z.object({
  title: z.string().min(1, "Title is required and cannot be empty"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const createTaskSchema = taskBaseSchema;

export const updateTaskSchema = taskBaseSchema.partial();

export const taskParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must contain only digits"),
});

export const taskQuerySchema = z.object({
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(20),
});
