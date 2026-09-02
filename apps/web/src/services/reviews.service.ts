import { apiClient } from '../lib/api-client';
import { ReviewInput } from '@hirelinks/contracts';

export type CreateReviewPayload = Omit<ReviewInput, 'customerPhoto' | 'removeImage'> & { 
  image?: File;
  removeImage?: boolean;
};

export const ReviewsService = {
  listReviews: async (params: { page?: number; limit?: number; search?: string; status?: string; moderationStatus?: string; featureOnHomepage?: boolean }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.moderationStatus) query.append('moderationStatus', params.moderationStatus);
    if (params.featureOnHomepage !== undefined) query.append('featureOnHomepage', params.featureOnHomepage.toString());
    
    return apiClient<any>(`/reviews?${query.toString()}`, { method: 'GET' });
  },

  getPublicReviews: async () => {
    return apiClient<any[]>('/reviews/public', { method: 'GET' });
  },

  getFeaturedReviews: async () => {
    return apiClient<any[]>('/reviews/public/featured', { method: 'GET' });
  },

  getReviewsByServiceSlug: async (slug: string) => {
    return apiClient<any[]>(`/reviews/public/service/${slug}`, { method: 'GET' });
  },

  getReviewsByProgramSlug: async (slug: string) => {
    return apiClient<any[]>(`/reviews/public/program/${slug}`, { method: 'GET' });
  },

  getReviewById: async (id: string) => {
    return apiClient<any>(`/reviews/${id}`, { method: 'GET' });
  },

  createReview: async (data: CreateReviewPayload) => {
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

    const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    // We use raw fetch here because apiClient sets 'Content-Type': 'application/json' 
    // which breaks multipart/form-data boundary generation.
    const res = await fetch(`${baseUrl}/reviews`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  },

  updateReview: async (id: string, data: Partial<CreateReviewPayload>) => {
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

    const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const res = await fetch(`${baseUrl}/reviews/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  },

  deleteReview: async (id: string) => {
    return apiClient(`/reviews/${id}`, { method: 'DELETE' });
  }
};
