import { Request, Response, NextFunction } from 'express';
import { BlogEngine } from './blog.service';
import { blogSchema } from '@hirelinks/contracts';

export class BlogController {
  static async listBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, publishStatus, isFeatured, sort } = req.query;
      
      const result = await BlogEngine.listBlogs({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        publishStatus: publishStatus as string,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
        sort: sort as string
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await BlogEngine.getPublicBlogs({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await BlogEngine.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getBlogBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await BlogEngine.getBySlug(req.params.slug);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = blogSchema.parse(req.body);
      const adminId = (req.user as any)?.id;
      
      const file = req.file;
      const data = await BlogEngine.createBlog(validatedData, adminId, file);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Create Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = blogSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.id;

      const file = req.file;
      const data = await BlogEngine.updateBlog(req.params.id, validatedData, adminId, file);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Update Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.id;
      await BlogEngine.softDelete(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
  
  static async restoreBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.id;
      await BlogEngine.restore(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Blog restored successfully' });
    } catch (error) {
      next(error);
    }
  }
}
