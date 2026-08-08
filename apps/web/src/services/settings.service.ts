import { apiClient } from '../lib/api-client';
import { SettingsInput } from '@hirelinks/contracts';

export type UpdateSettingsPayload = Omit<SettingsInput, 'logo' | 'darkLogo' | 'favicon' | 'defaultOgImage'> & {
  logo?: File | string | null;
  darkLogo?: File | string | null;
  favicon?: File | string | null;
  defaultOgImage?: File | string | null;
};

export const SettingsService = {
  getSettings: async () => {
    return apiClient<SettingsInput>('/settings', {
      method: 'GET'
    });
  },

  updateSettings: async (data: UpdateSettingsPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/settings`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  }
};
