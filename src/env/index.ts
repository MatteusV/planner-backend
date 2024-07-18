import { z } from 'zod'

const envSchema = z.object({
  API_BASE_URL: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  WEB_BASE_URL: z.string(),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
