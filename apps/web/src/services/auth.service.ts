import { apiClient } from '../lib/api-client';
import { LoginInput } from '@hirelinks/contracts';

export const AuthService = {
  login: async (credentials: LoginInput) => {
    return apiClient<{ user: { id: string; email: string; status: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  logout: async () => {
    return apiClient('/auth/logout', {
      method: 'POST'
    });
  },

  me: async () => {
    return apiClient<{ id: string; email: string; status: string }>('/auth/me', {
      method: 'GET'
    });
  }
};
