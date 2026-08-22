import { Router } from 'express';
import { PlacedStudentController } from './placed-student.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoint
router.get('/public', PlacedStudentController.getPublicPlacedStudents);

// Protected endpoints
router.get('/', requireAuth, PlacedStudentController.listPlacedStudents);
router.get('/:id', requireAuth, PlacedStudentController.getPlacedStudent);

// The 'image' field must match the FormData key appended in the frontend
router.post('/', requireAuth, upload.single('image'), PlacedStudentController.createPlacedStudent);
router.put('/:id', requireAuth, upload.single('image'), PlacedStudentController.updatePlacedStudent);
router.delete('/:id', requireAuth, PlacedStudentController.deletePlacedStudent);

export default router;
