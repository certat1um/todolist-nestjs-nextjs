import { successResponseSchema } from "@/src/common/factories";
import { z } from "zod";

enum CategoryType {
  WORK,
  PERSONAL,
  SHOPPING,
  HEALTH,
}

// Model schema
const categorySchema = z.object({
  id: z.uuid(),
  type: z.enum(CategoryType).transform((val) => String(val)),
  updated_at: z.string(),
  created_at: z.string(),
});

export type ICategory = z.infer<typeof categorySchema>;

// Payload & Response schemas
const getCategoriesResponseSchema = successResponseSchema(
  z.array(categorySchema),
);

export { categorySchema, getCategoriesResponseSchema };

// Types
type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;

export type { GetCategoriesResponse };
