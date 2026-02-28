/**
 * config/index.ts — Barrel export for all backend configuration modules.
 */
export { env, default } from './env';
export { connectMongoDB, disconnectMongoDB } from './mongodb';
export { model as geminiModel } from './gemini';
export { resend, emailFrom } from './resend';
