import { z } from 'zod';

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.boolean().default(true),
    message: z.string(),
    data: dataSchema,
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    status: z.boolean().default(true),
    message: z.string(),
    data: z.array(itemSchema),
    meta: z.object({
      next_cursor: z.string().nullable(),
    }),
  });

export type SuccessResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};
