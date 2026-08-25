import { Request, Response, NextFunction } from 'express';
import { PartnerLogoService } from './partner-logo.service';
import { partnerLogoSchema } from '@hirelinks/contracts';

export class PartnerLogoController {
  static async listPartnerLogos(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, category, sort } = req.query;

      const result = await PartnerLogoService.listPartnerLogos({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        category: category as string,
        sort: sort as string
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicPartnerLogos(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const data = await PartnerLogoService.getPublicPartnerLogos(category as string);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPartnerLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PartnerLogoService.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createPartnerLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = partnerLogoSchema.parse(req.body);
      const adminId = (req.user as any)?.userId;

      const data = await PartnerLogoService.createPartnerLogo(validatedData, adminId, req.file);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updatePartnerLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = partnerLogoSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.userId;

      const data = await PartnerLogoService.updatePartnerLogo(req.params.id, validatedData, adminId, req.file);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async deletePartnerLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.userId;
      await PartnerLogoService.softDelete(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Partner logo deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
