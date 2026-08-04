import { Settings } from './settings.model';
import { SettingsInput } from '@hirelinks/contracts';

export class SettingsService {
  /**
   * Retrieves the singleton settings document.
   */
  static async getSettings() {
    let settings = await Settings.findOne().lean();
    return settings;
  }

  /**
   * Upserts the singleton settings document.
   */
  static async upsertSettings(data: SettingsInput, adminId: string) {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create singleton if missing
      settings = new Settings({
        ...data,
        updatedBy: adminId
      });
      await settings.save();
    } else {
      // Update existing singleton
      Object.assign(settings, data);
      settings.updatedBy = adminId as any;
      await settings.save();
    }

    return settings;
  }
}
