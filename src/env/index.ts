import { z } from 'zod'

const envSchema = z.object({
  API_BASE_URL: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  WEB_BASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE: z.string(),
})

export const env = envSchema.parse(process.env)
