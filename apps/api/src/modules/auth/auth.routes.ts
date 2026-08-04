import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { loginRateLimiter } from '../../middlewares/rate-limiter.middleware';

const router: Router = Router();

router.post('/login', loginRateLimiter, AuthController.login);
router.post('/logout', requireAuth, AuthController.logout);
router.get('/me', requireAuth, AuthController.me);

export { router as authRoutes };
