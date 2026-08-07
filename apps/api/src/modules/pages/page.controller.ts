import { Request, Response, NextFunction } from 'express';
import { PageEngine } from './page.service';
import { pageSchema } from '@hirelinks/contracts';

export class PageController {
  static async getPage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PageEngine.getPage(req.params.slug);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updatePage(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = pageSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.id;

      const data = await PageEngine.updatePage(req.params.slug, validatedData, adminId, req.file);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
