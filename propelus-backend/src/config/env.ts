/**
 * config/env.ts — Environment variable loading and validation.
 * Loads .env from multiple locations (monorepo/standalone/production),
 * validates all required variables with Zod schema, and exports
 * the typed configuration object used throughout the backend.
 */
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Load .env — check multiple locations (monorepo / standalone / production)
const cwdEnv = path.resolve(process.cwd(), '.env');
const backendRootEnv = path.resolve(__dirname, '../../.env'); // propelus-backend/.env
const parentEnv = path.resolve(__dirname, '../../../.env');    // workspace root/.env

if (fs.existsSync(cwdEnv)) {
  config({ path: cwdEnv });
} else if (fs.existsSync(backendRootEnv)) {
  config({ path: backendRootEnv });
} else if (fs.existsSync(parentEnv)) {
  config({ path: parentEnv });
} else {
  // On Render / production, env vars are injected directly — no .env file needed
  config();
}

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),

  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB_NAME: z.string().default('propelus'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // External Services
  GEMINI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('PropelusAI <noreply@propelusai.com>'),
  EMAIL_TO: z.string().email().default('support@propelusai.com'),

  // Security
  BCRYPT_ROUNDS: z.string().default('12').transform(Number),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  const formatted = parsed.error.format();
  for (const [key, value] of Object.entries(formatted)) {
    if (key === '_errors') continue;
    const errors = (value as any)?._errors;
    if (errors?.length) {
      console.error(`  ${key}: ${errors.join(', ')}`);
    }
  }
  process.exit(1);
}

export const env = parsed.data;
export default env;
