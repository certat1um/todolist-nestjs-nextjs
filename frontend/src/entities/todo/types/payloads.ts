import { TODOS_BATCH_LIMIT } from "@/src/types/constants";
import z from "zod";

const getTodosQuerySchema = z
  .object({
    category_id: z.uuid(),
  })
  .partial();

const createTodoBodySchema = z.object({
  category_id: z.string().min(1, "Category is required."),
  title: z
    .string()
    .trim()
    .min(2, "Task title must be at least 2 characters length.")
    .max(50, "Task title is too long (50 characters)."),
});

const updateTodoBodySchema = z
  .object({
    is_done: z.boolean(),
    mark_as_deleted: z.boolean(),
  })
  .partial();

const batchUpdateTodosBodySchema = z.object({
  ids: z.uuid().array().nonempty().max(TODOS_BATCH_LIMIT),
  data: z
    .object({
      is_done: z.boolean(),
      mark_as_deleted: z.boolean(),
    })
    .partial(),
});

const batchDeleteTodosBodySchema = z.object({
  ids: z.uuid().array().nonempty().max(TODOS_BATCH_LIMIT),
});

export {
  getTodosQuerySchema,
  createTodoBodySchema,
  updateTodoBodySchema,
  batchUpdateTodosBodySchema,
  batchDeleteTodosBodySchema,
};

export type GetTodosQuery = z.infer<typeof getTodosQuerySchema>;
export type CreateTodoBody = z.infer<typeof createTodoBodySchema>;
export type UpdateTodoBody = z.infer<typeof updateTodoBodySchema>;
export type BatchUpdateTodosBody = z.infer<typeof batchUpdateTodosBodySchema>;
export type BatchDeleteTodosBody = z.infer<typeof batchDeleteTodosBodySchema>;
