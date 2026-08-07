import { Router } from 'express';
import { BlogController } from './blog.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../shared/upload.middleware';

const router: Router = Router();

// Public endpoints (Ensure `/public` is registered before `/:slug`)
router.get('/public', BlogController.getPublicBlogs);
router.get('/public/:slug', BlogController.getBlogBySlug);

// Protected endpoints
router.get('/', requireAuth, BlogController.listBlogs);
router.get('/:id', requireAuth, BlogController.getBlogById);

router.post('/', requireAuth, upload.single('image'), BlogController.createBlog);
router.put('/:id', requireAuth, upload.single('image'), BlogController.updateBlog);
router.delete('/:id', requireAuth, BlogController.deleteBlog);
router.put('/:id/restore', requireAuth, BlogController.restoreBlog);

export default router;
