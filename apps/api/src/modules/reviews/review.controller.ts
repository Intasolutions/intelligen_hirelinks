import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service';
import { reviewSchema } from '@hirelinks/contracts';

export class ReviewController {
  static async listReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, featureOnHomepage, sort } = req.query;
      
      const result = await ReviewService.listReviews({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        featureOnHomepage: featureOnHomepage === 'true' ? true : featureOnHomepage === 'false' ? false : undefined,
        sort: sort as string
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReviewService.getPublicReviews();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReviewService.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      // Body may have stringified JSON or raw string fields due to FormData.
      // Zod coerce will handle most of the typing correctly.
      const validatedData = reviewSchema.parse(req.body);
      const adminId = (req.user as any)?.id;

      const data = await ReviewService.createReview(validatedData, adminId, req.file);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = reviewSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.id;

      const data = await ReviewService.updateReview(req.params.id, validatedData, adminId, req.file);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.id;
      await ReviewService.softDelete(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
