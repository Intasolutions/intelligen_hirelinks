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
      const validatedData = settingsSchema.parse(req.body);
      
      const adminId = (req.user as any)?.id;
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
