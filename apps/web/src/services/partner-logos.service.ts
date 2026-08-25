import { apiClient } from '../lib/api-client';
import { PartnerLogoInput } from '@hirelinks/contracts';

export type CreatePartnerLogoPayload = Omit<PartnerLogoInput, 'removeLogo'> & {
  logo?: File;
  removeLogo?: boolean;
};

export const PartnerLogosService = {
  listPartnerLogos: async (params: { page?: number; limit?: number; search?: string; status?: string; category?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.category) query.append('category', params.category);
    if (params.sort) query.append('sort', params.sort);

    return apiClient<any>(`/partner-logos?${query.toString()}`, { method: 'GET' });
  },

  getPublicPartnerLogos: async (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return apiClient<any[]>(`/partner-logos/public${query}`, { method: 'GET' });
  },

  getPartnerLogoById: async (id: string) => {
    return apiClient<any>(`/partner-logos/${id}`, { method: 'GET' });
  },

  createPartnerLogo: async (data: CreatePartnerLogoPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    // Raw fetch: apiClient sets 'Content-Type': 'application/json' which breaks
    // multipart/form-data boundary generation.
    const res = await fetch(`${baseUrl}/partner-logos`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return res.json();
  },

  updatePartnerLogo: async (id: string, data: Partial<CreatePartnerLogoPayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/partner-logos/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    return res.json();
  },

  deletePartnerLogo: async (id: string) => {
    return apiClient(`/partner-logos/${id}`, { method: 'DELETE' });
  }
};
