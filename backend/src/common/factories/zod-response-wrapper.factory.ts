import { z } from 'zod';

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.boolean().default(true),
    message: z.string(),
    data: dataSchema,
  });
