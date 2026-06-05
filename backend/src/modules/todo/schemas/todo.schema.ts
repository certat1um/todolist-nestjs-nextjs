import { createZodDto } from 'nestjs-zod';
import { successResponseSchema } from 'src/common/factories';
import { TODOS_BATCH_LIMIT } from 'src/common/types/constants';
import { z } from 'zod';

// Model schema
const todoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  is_done: z.boolean(),
  category_id: z.uuid(),
  completed_at: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
});

// Payload & Response schemas
const getTodosResponseSchema = successResponseSchema(z.array(todoSchema));

const getTodosQuerySchema = z
  .object({
    category_id: z.uuid(),
  })
  .partial();

const createTodoResponseSchema = successResponseSchema(todoSchema);

const createTodoBodySchema = z.object({
  category_id: z.uuid(),
  title: z.string().trim().min(2).max(255),
});

const updateTodoResponseSchema = successResponseSchema(todoSchema);

const updateTodoParamsSchema = z.object({
  id: z.uuid(),
});

const updateTodoBodySchema = z
  .object({
    is_done: z.boolean(),
    mark_as_deleted: z.boolean(),
  })
  .partial();

const batchUpdateTodosResponseSchema = successResponseSchema(
  z.object({
    ids: z.uuid().array(),
  }),
);

const batchUpdateTodosBodySchema = z.object({
  ids: z.uuid().array().nonempty().max(TODOS_BATCH_LIMIT),
  data: z
    .object({
      is_done: z.boolean(),
      mark_as_deleted: z.boolean(),
    })
    .partial(),
});

const deleteTodoResponseSchema = successResponseSchema(
  z.object({ id: z.uuid() }),
);

const deleteTodoParamsSchema = z.object({
  id: z.uuid(),
});

const batchDeleteTodosResponseSchema = successResponseSchema(
  z.object({
    ids: z.uuid().array(),
  }),
);

const batchDeleteTodosQuerySchema = z.object({
  ids: z.uuid().array().nonempty().max(TODOS_BATCH_LIMIT),
});

export {
  todoSchema,
  getTodosResponseSchema,
  getTodosQuerySchema,
  createTodoResponseSchema,
  createTodoBodySchema,
  updateTodoResponseSchema,
  updateTodoParamsSchema,
  updateTodoBodySchema,
  batchUpdateTodosResponseSchema,
  batchUpdateTodosBodySchema,
  deleteTodoResponseSchema,
  deleteTodoParamsSchema,
  batchDeleteTodosResponseSchema,
  batchDeleteTodosQuerySchema,
};

export type ITodo = z.infer<typeof todoSchema>;

// Classes
class GetTodosResponse extends createZodDto(getTodosResponseSchema) {}
class GetTodosQuery extends createZodDto(getTodosQuerySchema) {}
class CreateTodoResponse extends createZodDto(createTodoResponseSchema) {}
class CreateTodoBody extends createZodDto(createTodoBodySchema) {}
class UpdateTodoResponse extends createZodDto(updateTodoResponseSchema) {}
class UpdateTodoParams extends createZodDto(updateTodoParamsSchema) {}
class UpdateTodoBody extends createZodDto(updateTodoBodySchema) {}
class BatchUpdateTodosResponse extends createZodDto(
  batchUpdateTodosResponseSchema,
) {}
class BatchUpdateTodosBody extends createZodDto(batchUpdateTodosBodySchema) {}
class DeleteTodoResponse extends createZodDto(deleteTodoResponseSchema) {}
class DeleteTodoParams extends createZodDto(deleteTodoParamsSchema) {}
class BatchDeleteTodosResponse extends createZodDto(
  batchDeleteTodosResponseSchema,
) {}
class BatchDeleteTodosQuery extends createZodDto(batchDeleteTodosQuerySchema) {}

export {
  GetTodosQuery,
  GetTodosResponse,
  CreateTodoBody,
  CreateTodoResponse,
  UpdateTodoResponse,
  UpdateTodoParams,
  UpdateTodoBody,
  BatchUpdateTodosResponse,
  BatchUpdateTodosBody,
  DeleteTodoResponse,
  DeleteTodoParams,
  BatchDeleteTodosResponse,
  BatchDeleteTodosQuery,
};
