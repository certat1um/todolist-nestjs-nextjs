import { z } from 'zod';

export const CategoryTypeEnum = z.enum([
  'WORK',
  'PERSONAL',
  'SHOPPING',
  'HEALTH',
]);

export const CreateTodoSchema = z.object({
  title: z
    .string({ error: 'title is required' })
    .trim()
    .min(2, 'title must not be empty')
    .max(255, 'title must be at most 255 characters'),

  category_id: z.uuid({ error: 'category_id is required' }),
});

export const UpdateTodoSchema = z.object({
  is_done: z.boolean({ error: 'is_done is required' }),
  mark_as_deleted: z.boolean().default(false),
});

export const GetTodosQuerySchema = z.object({
  category_id: z.uuid().optional(),
});

export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>;
export type GetTodosQueryDto = z.infer<typeof GetTodosQuerySchema>;
