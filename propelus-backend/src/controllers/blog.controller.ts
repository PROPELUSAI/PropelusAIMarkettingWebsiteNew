import { Request, Response } from 'express';
import { Blog } from '../db/mongodb/models/Blog';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

/**
 * GET /api/v1/blogs
 * Returns all published blogs, newest first.
 * Supports: ?category=AI&featured=true&limit=10&page=1
 */
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, limit = '20', page = '1' } = req.query;

  const filter: Record<string, unknown> = { status: 'published' };

  if (category && typeof category === 'string') {
    filter.category = { $regex: new RegExp(category, 'i') };
  }
  if (featured === 'true') {
    filter.is_featured = true;
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select('title subtitle slug category tags featured_image is_featured status publish_date created_at seo_title meta_description read_time view_count author')
      .sort({ publish_date: -1, created_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, blogs, pageNum, limitNum, total);
});

/**
 * GET /api/v1/blogs/:slug
 * Returns a single published blog by slug, increments view count.
 */
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const blog = await Blog.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { view_count: 1 } },
    { new: true }
  ).lean();

  if (!blog) throw ApiError.notFound('Blog post not found');

  ApiResponse.success(res, blog);
});

/**
 * GET /api/v1/blogs/categories
 * Returns distinct categories from published blogs.
 */
export const getBlogCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Blog.distinct('category', { status: 'published' });
  ApiResponse.success(res, categories);
});
