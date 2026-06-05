import { CategoryType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { successResponseSchema } from 'src/common/factories';
import { z } from 'zod';

// Model schema
const categorySchema = z.object({
  id: z.uuid(),
  type: z.enum(CategoryType),
  updated_at: z.string(),
  created_at: z.string(),
});

export type ICategory = z.infer<typeof categorySchema>;

// Payload & Response schemas
const getCategoriesResponseSchema = successResponseSchema(
  z.array(categorySchema),
);

export { categorySchema, getCategoriesResponseSchema };

// Classes
class GetCategoriesResponse extends createZodDto(getCategoriesResponseSchema) {}

export { GetCategoriesResponse };
