import { z } from 'zod';

export const configSchema = z.object({
  APP_PORT: z.string().transform(Number),
  CLIENT_URL: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
});

export type ConfigType = z.infer<typeof configSchema>;
