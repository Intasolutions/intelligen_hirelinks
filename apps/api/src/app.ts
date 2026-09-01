import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';
import { sendResponse } from './shared/response';
import { authRoutes } from './modules/auth/auth.routes';
import { settingsRoutes } from './modules/settings';
import { reviewRoutes } from './modules/reviews';
import { serviceRoutes } from './modules/services';
import { programRoutes } from './modules/programs';
import { blogRoutes } from './modules/blogs';
import { pageRoutes } from './modules/pages';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { contactRoutes } from './modules/contacts/contact.routes';
import { placedStudentRoutes } from './modules/placed-students';
import { partnerLogoRoutes } from './modules/partner-logos';

const app: Express = express();

// Security Middlewares
// Frontend and API are on different domains by design (see cookieOptions in
// shared/jwt.ts) — helmet's default Cross-Origin-Resource-Policy:
// 'same-origin' blocks exactly that legitimate cross-origin use, so it's
// relaxed to 'cross-origin' here. The cors() middleware below still
// enforces which origins are actually allowed.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// FRONTEND_URL supports a comma-separated list so both the production
// domain and localhost (for developing against a deployed API) can be
// allowed at once. `credentials: true` cookies cannot be paired with a
// wildcard origin per the CORS spec, so each allowed origin must be
// checked explicitly and echoed back rather than reflecting every origin.
const allowedOrigins = env.FRONTEND_URL.split(',').map((url) => url.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Same-origin/non-browser requests (curl, server-to-server, health
    // checks) send no Origin header at all — allow those through.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));
app.use(hpp());

// Optimization Middlewares
app.use(compression());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Middlewares
app.use(requestIdMiddleware);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

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
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/placed-students', placedStudentRoutes);
app.use('/api/v1/partner-logos', partnerLogoRoutes);
app.use('/api/v1', router);

// Handle 404
app.use((req, res) => {
  sendResponse(res, 404, false, null, { code: 404, message: 'Route not found' });
});

// Global Error Handler
app.use(globalErrorHandler);

export { app };
