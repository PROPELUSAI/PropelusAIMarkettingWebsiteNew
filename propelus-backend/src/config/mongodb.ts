/**
 * mongodb.ts — MongoDB connection management via Mongoose.
 * Provides connectMongoDB and disconnectMongoDB functions used by server.ts.
 */
import mongoose from 'mongoose';
import env from './env';
import { logger } from '../utils/logger';

/**
 * Connect to MongoDB
 */
export async function connectMongoDB(): Promise<void> {
  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }

  // Connection event handlers
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectMongoDB(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}

export { mongoose };
