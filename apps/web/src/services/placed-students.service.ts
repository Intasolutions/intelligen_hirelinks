import { apiClient } from '../lib/api-client';
import { PlacedStudentInput } from '@hirelinks/contracts';

export type CreatePlacedStudentPayload = Omit<PlacedStudentInput, 'removeImage'> & {
  image?: File;
  removeImage?: boolean;
};

export const PlacedStudentsService = {
  listPlacedStudents: async (params: { page?: number; limit?: number; search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);

    return apiClient<any>(`/placed-students?${query.toString()}`, { method: 'GET' });
  },

  getPublicPlacedStudents: async () => {
    return apiClient<any[]>('/placed-students/public', { method: 'GET' });
  },

  getPlacedStudentById: async (id: string) => {
    return apiClient<any>(`/placed-students/${id}`, { method: 'GET' });
  },

  createPlacedStudent: async (data: CreatePlacedStudentPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    // We use raw fetch here because apiClient sets 'Content-Type': 'application/json'
    // which breaks multipart/form-data boundary generation.
    const res = await fetch(`${baseUrl}/placed-students`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return res.json();
  },

  updatePlacedStudent: async (id: string, data: Partial<CreatePlacedStudentPayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/placed-students/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    return res.json();
  },

  deletePlacedStudent: async (id: string) => {
    return apiClient(`/placed-students/${id}`, { method: 'DELETE' });
  }
};
