import { apiClient } from '../lib/api-client';
import { SettingsInput } from '@hirelinks/contracts';

export const SettingsService = {
  getSettings: async () => {
    return apiClient<SettingsInput>('/settings', {
      method: 'GET'
    });
  },

  updateSettings: async (data: SettingsInput) => {
    return apiClient<SettingsInput>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};
