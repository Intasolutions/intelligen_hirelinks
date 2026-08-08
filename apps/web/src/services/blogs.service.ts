import { apiClient } from '../lib/api-client';
import { BlogInput } from '@hirelinks/contracts';

export type CreateBlogPayload = Omit<BlogInput, 'image' | 'removeImage'> & { 
  image?: File;
  removeImage?: boolean;
};

export const BlogsService = {
  listBlogs: async (params: { 
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
    
    return apiClient<any>(`/blogs?${query.toString()}`, { method: 'GET' });
  },

  getPublicBlogs: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiClient<any>(`/blogs/public?${query.toString()}`, { method: 'GET' });
  },
  
  getBlogBySlug: async (slug: string) => {
    return apiClient<any>(`/blogs/public/${slug}`, { method: 'GET' });
  },
  
  getBlogById: async (id: string) => {
    return apiClient<any>(`/blogs/${id}`, { method: 'GET' });
  },

  createBlog: async (data: CreateBlogPayload) => {
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

    const res = await fetch(`${baseUrl}/blogs`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  },

  updateBlog: async (id: string, data: Partial<CreateBlogPayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          if (key === 'image') {
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

    const res = await fetch(`${baseUrl}/blogs/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    
    return res.json();
  },

  deleteBlog: async (id: string) => {
    return apiClient(`/blogs/${id}`, { method: 'DELETE' });
  },

  restoreBlog: async (id: string) => {
    return apiClient(`/blogs/${id}/restore`, { method: 'PUT' });
  }
};
