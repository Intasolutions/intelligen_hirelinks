import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { settingsSchema } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';

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
        if (files['logo']?.[0]) {
          const result = await CloudinaryService.uploadBuffer(files['logo'][0].buffer, 'settings');
          body.logo = result.url;
        }
        if (files['darkLogo']?.[0]) {
          const result = await CloudinaryService.uploadBuffer(files['darkLogo'][0].buffer, 'settings');
          body.darkLogo = result.url;
        }
        if (files['favicon']?.[0]) {
          const result = await CloudinaryService.uploadBuffer(files['favicon'][0].buffer, 'settings');
          body.favicon = result.url;
        }
        if (files['defaultOgImage']?.[0]) {
          const result = await CloudinaryService.uploadBuffer(files['defaultOgImage'][0].buffer, 'settings');
          body.defaultOgImage = result.url;
        }
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
