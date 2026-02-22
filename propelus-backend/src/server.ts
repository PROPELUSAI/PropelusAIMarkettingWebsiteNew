import app from './app';
import env from './config/env';
import { connectMongoDB, disconnectMongoDB } from './config/mongodb';
import { logger } from './utils/logger';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    // ── Connect to MongoDB ──
    logger.info('🔌 Connecting to MongoDB...');
    await connectMongoDB();
    logger.info('✅ Database connection established');

    // ── Start HTTP server ──
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📋 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌐 Environment: ${env.NODE_ENV}`);
    });

    // ── Graceful shutdown ──
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await disconnectMongoDB();
          logger.info('✅ Database connection closed. Goodbye!');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after 10s timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
