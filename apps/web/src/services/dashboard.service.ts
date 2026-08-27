import { apiClient } from '../lib/api-client';

export interface DashboardStats {
  services: number;
  programs: number;
  blogs: number;
  reviews: number;
  enquiries: number;
}

export interface RecentContent {
  id: string;
  title: string;
  type: 'SERVICE' | 'PROGRAM' | 'BLOG' | 'REVIEW';
  status: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentContent: RecentContent[];
}

export const DashboardService = {
  getDashboardData: async () => {
    return apiClient<DashboardData>('/dashboard', {
      method: 'GET',
    });
  }
};
