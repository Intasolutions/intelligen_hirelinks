import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from './logger';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB Connection Error: ${err}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  }
};
