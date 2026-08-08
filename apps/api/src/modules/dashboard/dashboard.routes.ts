import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router: Router = Router();

// All dashboard routes are protected
router.use(requireAuth);

router.get('/', DashboardController.getDashboard);

export { router as dashboardRoutes };
