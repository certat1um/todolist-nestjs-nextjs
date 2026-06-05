import z from "zod";

const updateTodoParamsSchema = z.object({
  id: z.uuid(),
});

const deleteTodoParamsSchema = z.object({
  id: z.uuid(),
});

export type UpdateTodoParams = z.infer<typeof updateTodoParamsSchema>;
export type DeleteTodoParams = z.infer<typeof deleteTodoParamsSchema>;
