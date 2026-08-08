import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { settingsSchema } from '@hirelinks/contracts';

export class SettingsController {
  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getSettings();
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const body = { ...req.body };
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files) {
        if (files['logo']?.[0]) body.logo = `/uploads/${files['logo'][0].filename}`;
        if (files['darkLogo']?.[0]) body.darkLogo = `/uploads/${files['darkLogo'][0].filename}`;
        if (files['favicon']?.[0]) body.favicon = `/uploads/${files['favicon'][0].filename}`;
        if (files['defaultOgImage']?.[0]) body.defaultOgImage = `/uploads/${files['defaultOgImage'][0].filename}`;
      }

      // Convert "null" strings from FormData back to null or empty string
      for (const key in body) {
        if (body[key] === 'null' || body[key] === 'undefined') body[key] = null;
        if (body[key] === 'true') body[key] = true;
        if (body[key] === 'false') body[key] = false;
      }

      if (typeof body.addresses === 'string') {
        try {
          body.addresses = JSON.parse(body.addresses);
        } catch (e) {
          // fallback
          body.addresses = [];
        }
      }

      const validatedData = settingsSchema.parse(body);
      
      const adminId = (req.user as any)?.userId;
      if (!adminId) {
         res.status(401).json({ success: false, message: 'Unauthorized' });
         return;
      }

      const settings = await SettingsService.upsertSettings(validatedData, adminId);
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }
}
