import { Request, Response, NextFunction } from 'express';
import { ProgramEngine } from './program.service';
import { programSchema } from '@hirelinks/contracts';

export class ProgramController {
  static async listPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, publishStatus, isFeatured, sort } = req.query;
      
      const result = await ProgramEngine.listPrograms({
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

  static async getPublicPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProgramEngine.getPublicPrograms();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getProgramById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProgramEngine.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getProgramBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProgramEngine.getBySlug(req.params.slug);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = programSchema.parse(req.body);
      const adminId = (req.user as any)?.userId;
      
      const files = req.files as {
        primaryImage?: Express.Multer.File[];
        secondaryImage?: Express.Multer.File[];
      };

      const data = await ProgramEngine.createProgram(validatedData, adminId, files);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Create Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = programSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.userId;

      const files = req.files as {
        primaryImage?: Express.Multer.File[];
        secondaryImage?: Express.Multer.File[];
      };

      const data = await ProgramEngine.updateProgram(req.params.id, validatedData, adminId, files);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Update Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.userId;
      await ProgramEngine.softDelete(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Program deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
