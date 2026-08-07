import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './config/env';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';
import { sendResponse } from './shared/response';
import { authRoutes } from './modules/auth/auth.routes';
import { settingsRoutes } from './modules/settings';
import { reviewRoutes } from './modules/reviews';
import { serviceRoutes } from './modules/services';

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(hpp());

// Optimization Middlewares
app.use(compression());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Middlewares
app.use(requestIdMiddleware);

// Routes
const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
  const data = {
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0', // Could read from package.json in future
    database: {
      connected: mongoose.connection.readyState === 1
    }
  };
  sendResponse(res, 200, true, data);
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1', router);

// Handle 404
app.use((req, res) => {
  sendResponse(res, 404, false, null, { code: 404, message: 'Route not found' });
});

// Global Error Handler
app.use(globalErrorHandler);

export { app };
