import { Router } from 'express';
import { PageController } from './page.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoint
router.get('/:slug', PageController.getPage);

// Protected endpoint (upsert)
router.put('/:slug', requireAuth, upload.single('image'), PageController.updatePage);

export default router;
