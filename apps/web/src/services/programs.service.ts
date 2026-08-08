import { apiClient } from '../lib/api-client';
import { ProgramInput } from '@hirelinks/contracts';

export type CreateProgramPayload = Omit<ProgramInput, 'primaryImage' | 'secondaryImage' | 'removePrimaryImage' | 'removeSecondaryImage'> & { 
  primaryImage?: File;
  secondaryImage?: File;
  removePrimaryImage?: boolean;
  removeSecondaryImage?: boolean;
};

export const ProgramsService = {
  listPrograms: async (params: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    publishStatus?: string;
    isFeatured?: boolean;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.publishStatus) query.append('publishStatus', params.publishStatus);
    if (params.isFeatured !== undefined) query.append('isFeatured', params.isFeatured.toString());
    if (params.sort) query.append('sort', params.sort);
    
    return apiClient<any>(`/programs?${query.toString()}`, { method: 'GET' });
  },

  getPublicPrograms: async () => {
    return apiClient<any[]>('/programs/public', { method: 'GET' });
  },
  
  getProgramBySlug: async (slug: string) => {
    return apiClient<any>(`/programs/public/${slug}`, { method: 'GET' });
  },
  
  getProgramById: async (id: string) => {
    return apiClient<any>(`/programs/${id}`, { method: 'GET' });
  },

  createProgram: async (data: CreateProgramPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/programs`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  },

  updateProgram: async (id: string, data: Partial<CreateProgramPayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          // Exclude the stringified URL objects if they haven't been replaced by a File
          if (key === 'primaryImage' || key === 'secondaryImage') {
             // If it's an object but not a File, it's the old cloudinary response. Skip.
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/programs/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  },

  deleteProgram: async (id: string) => {
    return apiClient(`/programs/${id}`, { method: 'DELETE' });
  }
};
