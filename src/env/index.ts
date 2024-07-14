import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(`Error environment variables`);
  throw new Error(`Error environment variables`);
}

export const env = _env.data;
