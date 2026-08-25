import { Router } from 'express';
import { PartnerLogoController } from './partner-logo.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoint — supports ?category=DOMESTIC|INTERNATIONAL|CERTIFICATION
router.get('/public', PartnerLogoController.getPublicPartnerLogos);

// Protected endpoints
router.get('/', requireAuth, PartnerLogoController.listPartnerLogos);
router.get('/:id', requireAuth, PartnerLogoController.getPartnerLogo);

// The 'logo' field must match the FormData key appended in the frontend
router.post('/', requireAuth, upload.single('logo'), PartnerLogoController.createPartnerLogo);
router.put('/:id', requireAuth, upload.single('logo'), PartnerLogoController.updatePartnerLogo);
router.delete('/:id', requireAuth, PartnerLogoController.deletePartnerLogo);

export default router;
