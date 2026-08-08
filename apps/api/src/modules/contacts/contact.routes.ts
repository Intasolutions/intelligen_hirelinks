import { Router } from 'express';
import { ContactController } from './contact.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router: Router = Router();

// Public endpoint
router.post('/public', ContactController.createPublic);

// Admin endpoints
router.use(requireAuth);

router.get('/stats', ContactController.getStats);
router.get('/', ContactController.listContacts);
router.get('/:id', ContactController.getContactById);
router.put('/:id/status', ContactController.updateStatus);
router.delete('/:id', ContactController.deleteContact);

export { router as contactRoutes };
