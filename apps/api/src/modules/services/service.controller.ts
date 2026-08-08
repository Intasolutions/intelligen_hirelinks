import { Request, Response, NextFunction } from 'express';
import { ServiceEngine } from './service.service';
import { serviceSchema } from '@hirelinks/contracts';

export class ServiceController {
  static async listServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, publishStatus, isFeatured, sort } = req.query;
      
      const result = await ServiceEngine.listServices({
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

  static async getPublicServices(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServiceEngine.getPublicServices();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServiceEngine.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getServiceBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServiceEngine.getBySlug(req.params.slug);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = serviceSchema.parse(req.body);
      const adminId = (req.user as any)?.userId;
      
      const files = req.files as {
        primaryImage?: Express.Multer.File[];
        secondaryImage?: Express.Multer.File[];
      };

      const data = await ServiceEngine.createService(validatedData, adminId, files);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Create Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = serviceSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.userId;

      const files = req.files as {
        primaryImage?: Express.Multer.File[];
        secondaryImage?: Express.Multer.File[];
      };

      const data = await ServiceEngine.updateService(req.params.id, validatedData, adminId, files);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Update Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.userId;
      await ServiceEngine.softDelete(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
