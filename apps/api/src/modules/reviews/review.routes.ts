import { Router } from 'express';
import { ReviewController } from './review.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoint
router.get('/public', ReviewController.getPublicReviews);
router.get('/public/featured', ReviewController.getFeaturedReviews);
router.get('/public/service/:slug', ReviewController.getReviewsByServiceSlug);
router.get('/public/program/:slug', ReviewController.getReviewsByProgramSlug);

// Protected endpoints
router.get('/', requireAuth, ReviewController.listReviews);
router.get('/:id', requireAuth, ReviewController.getReview);

// The 'image' field must match the FormData key appended in the frontend
router.post('/', requireAuth, upload.single('image'), ReviewController.createReview);
router.put('/:id', requireAuth, upload.single('image'), ReviewController.updateReview);
router.delete('/:id', requireAuth, ReviewController.deleteReview);

export default router;
