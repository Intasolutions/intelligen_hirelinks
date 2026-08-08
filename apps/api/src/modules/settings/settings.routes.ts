import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

router.get('/', SettingsController.getSettings);
router.put('/', requireAuth, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'darkLogo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'defaultOgImage', maxCount: 1 }
]), SettingsController.updateSettings);

export default router;
