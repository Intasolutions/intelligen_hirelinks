import { Router } from 'express';
import { ServiceController } from './service.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoints
router.get('/public', ServiceController.getPublicServices);
router.get('/public/:slug', ServiceController.getServiceBySlug);

// Protected endpoints
router.get('/', requireAuth, ServiceController.listServices);
router.get('/:id', requireAuth, ServiceController.getServiceById);

const uploadFields = upload.fields([
  { name: 'primaryImage', maxCount: 1 },
  { name: 'secondaryImage', maxCount: 1 }
]);

router.post('/', requireAuth, uploadFields, ServiceController.createService);
router.put('/:id', requireAuth, uploadFields, ServiceController.updateService);
router.delete('/:id', requireAuth, ServiceController.deleteService);

export default router;
