import { Router } from 'express';
import { ProgramController } from './program.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoints (Ensure `/public` is registered before `/:slug`)
router.get('/public', ProgramController.getPublicPrograms);
router.get('/public/:slug', ProgramController.getProgramBySlug);

// Protected endpoints
router.get('/', requireAuth, ProgramController.listPrograms);
router.get('/:id', requireAuth, ProgramController.getProgramById);

const uploadFields = upload.fields([
  { name: 'primaryImage', maxCount: 1 },
  { name: 'secondaryImage', maxCount: 1 }
]);

router.post('/', requireAuth, uploadFields, ProgramController.createProgram);
router.put('/:id', requireAuth, uploadFields, ProgramController.updateProgram);
router.delete('/:id', requireAuth, ProgramController.deleteProgram);

export default router;
