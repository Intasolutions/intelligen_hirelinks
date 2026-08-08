import { apiClient } from '../lib/api-client';
import { ContactInput } from '@hirelinks/contracts';

export const ContactsService = {
  createPublic: async (data: ContactInput) => {
    return apiClient<any>('/contacts/public', { 
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  listContacts: async (params: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.type) query.append('type', params.type);
    
    return apiClient<any>(`/contacts?${query.toString()}`, { method: 'GET' });
  },

  getContactById: async (id: string) => {
    return apiClient<any>(`/contacts/${id}`, { method: 'GET' });
  },

  updateStatus: async (id: string, status: string) => {
    return apiClient<any>(`/contacts/${id}/status`, { 
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  deleteContact: async (id: string) => {
    return apiClient(`/contacts/${id}`, { method: 'DELETE' });
  },

  getStats: async () => {
    return apiClient<any>('/contacts/stats', { method: 'GET' });
  }
};
