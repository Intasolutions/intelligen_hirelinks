import { apiClient } from '../lib/api-client';
import { PageInput } from '@hirelinks/contracts';

export type UpdatePagePayload = Omit<PageInput, 'removeImage'> & { 
  image?: File;
  removeImage?: boolean;
};

export const PagesService = {
  getPage: async (slug: string) => {
    return apiClient<any>(`/pages/${slug}`, { method: 'GET' });
  },

  updatePage: async (slug: string, data: Partial<UpdatePagePayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (typeof value === 'object') {
          // e.g. `seo` — FormData only holds strings/Files, and a plain
          // .toString() on an object produces the useless "[object Object]"
          // rather than its actual data, which the backend's jsonParseString
          // preprocessor can't parse back into an object.
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/pages/${slug}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  }
};
