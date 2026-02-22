import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import env from './env';
import { logger } from '../utils/logger';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
      topP: 0.9,
      topK: 40,
    },
  });
  logger.info('✅ Gemini AI configured');
} else {
  logger.warn('⚠️ GEMINI_API_KEY not set — chatbot will use rule-based responses only');
}

export { genAI, model };
