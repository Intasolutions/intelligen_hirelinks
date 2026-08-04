import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router: Router = Router();

router.get('/', SettingsController.getSettings);
router.put('/', requireAuth, SettingsController.updateSettings);

export default router;
