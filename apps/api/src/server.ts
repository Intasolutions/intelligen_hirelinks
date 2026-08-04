import { app } from './app';
import { env } from './config/env';
import { connectDatabase } from './shared/database';
import { logger } from './shared/logger';

const startServer = async () => {
  // 1. Connect to Database
  await connectDatabase();

  // 2. Start Express Server
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 API Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // 3. Graceful Shutdown
  const shutdown = () => {
    logger.info('🛑 Shutting down server...');
    server.close(() => {
      logger.info('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
