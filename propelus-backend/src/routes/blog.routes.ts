import { Router } from 'express';
import { getBlogs, getBlogBySlug, getBlogCategories } from '../controllers/blog.controller';

const router = Router();

// Public routes — no auth needed
router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);

export default router;
