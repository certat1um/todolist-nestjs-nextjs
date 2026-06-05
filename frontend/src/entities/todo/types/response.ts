import { successResponseSchema } from "@/src/common/factories";
import z from "zod";

const todoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  is_done: z.boolean(),
  category_id: z.uuid(),
  completed_at: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
});

const getTodosResponseSchema = successResponseSchema(z.array(todoSchema));

const createTodoResponseSchema = successResponseSchema(todoSchema);

const updateTodoResponseSchema = successResponseSchema(todoSchema);

const batchUpdateTodosResponseSchema = successResponseSchema(
  z.object({
    ids: z.uuid().array(),
  }),
);

const deleteTodoResponseSchema = successResponseSchema(
  z.object({ id: z.uuid() }),
);

const batchDeleteTodosResponseSchema = successResponseSchema(
  z.object({
    ids: z.uuid().array(),
  }),
);

export type ITodo = z.infer<typeof todoSchema>;

export type GetTodosResponse = z.infer<typeof getTodosResponseSchema>;
export type CreateTodoResponse = z.infer<typeof createTodoResponseSchema>;
export type UpdateTodoResponse = z.infer<typeof updateTodoResponseSchema>;
export type BatchUpdateTodosResponse = z.infer<
  typeof batchUpdateTodosResponseSchema
>;
export type DeleteTodoResponse = z.infer<typeof deleteTodoResponseSchema>;
export type BatchDeleteTodosResponse = z.infer<
  typeof batchDeleteTodosResponseSchema
>;
