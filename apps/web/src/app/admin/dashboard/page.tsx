import { AdminPage } from '../../../components/admin/common/AdminPage';
import { MessageSquare, FileText, Briefcase, CheckCircle2, ArrowRight, Settings } from 'lucide-react';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Home - CMS'
};

export default async function DashboardPage() {
  let dashboardData = null;
  let user = null;
  let errorMsg = null;

  try {
    const [dashRes, userRes] = await Promise.all([
      DashboardService.getDashboardData(),
      AuthService.me()
    ]);
    
    if (dashRes.success) dashboardData = dashRes.data;
    if (userRes.success) user = userRes.data;
  } catch (error: any) {
    errorMsg = error.message;
  }

  const name = user?.email?.split('@')[0] || 'Admin';
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  if (errorMsg || !dashboardData) {
    return (
      <AdminPage title="Admin Home">
        <div className="rounded-lg bg-red-900/20 p-4 border border-red-500/30">
          <p className="text-sm font-medium text-red-400">Failed to load dashboard data.</p>
          <p className="text-sm text-red-300 mt-1">{errorMsg || 'Unknown error'}</p>
        </div>
      </AdminPage>
    );
  }

  const { stats, recentContent } = dashboardData;

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="mb-8 border-b border-admin-card pb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          Welcome back, {capitalizedName} <span className="text-2xl">👋</span>
        </h1>
        <p className="mt-2 text-gray-400">
          Here's what's happening with your platform today. You have <span className="text-admin-accent font-medium">{stats.enquiries} new enquiries</span> waiting for review.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="overflow-hidden rounded-xl bg-admin-bg p-6 shadow-sm border border-admin-card relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#252525]">
              <MessageSquare className="h-6 w-6 text-admin-accent" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{stats.enquiries}</p>
            <p className="text-sm font-medium text-gray-400">Total Enquiries</p>
          </div>
        </div>

        {/* Blog Articles */}
        <div className="overflow-hidden rounded-xl bg-admin-bg p-6 shadow-sm border border-admin-card relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#252525]">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center px-2.5 py-1 rounded-full bg-admin-accent/10 border border-admin-accent/20">
              <span className="text-xs font-medium text-admin-accent flex items-center gap-1">
                <ArrowRight className="w-3 h-3 -rotate-45" />
                Published
              </span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{stats.blogs}</p>
            <p className="text-sm font-medium text-gray-400">Blog Articles</p>
          </div>
        </div>

        {/* Active Services */}
        <div className="overflow-hidden rounded-xl bg-admin-bg p-6 shadow-sm border border-admin-card relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#252525]">
              <Briefcase className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{stats.services}</p>
            <p className="text-sm font-medium text-gray-400">Active Services</p>
          </div>
        </div>

        {/* Resolved Cases (Reviews/Programs placeholder) */}
        <div className="overflow-hidden rounded-xl bg-admin-bg p-6 shadow-sm border border-admin-card relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#252525]">
              <CheckCircle2 className="h-6 w-6 text-teal-400" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">{stats.reviews}</p>
            <p className="text-sm font-medium text-gray-400">Resolved Cases</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enquiries / Content */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl bg-admin-bg shadow-sm border border-admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Content</h2>
            <button className="text-sm font-medium text-admin-accent hover:text-white transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentContent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No recent content found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentContent.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 rounded-lg bg-[#252525] border border-transparent hover:border-admin-card transition-colors">
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-admin-accent">{item.type}</span>
                      <span>•</span>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      item.status.toUpperCase() === 'ACTIVE' || item.status.toUpperCase() === 'PUBLISHED' 
                      ? 'bg-admin-accent/10 text-admin-accent' 
                      : 'bg-gray-800 text-gray-400'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                    <Link href={`/admin/${item.type.toLowerCase()}s/${item.id}`} className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-admin-bg shadow-sm border border-admin-card p-6">
          <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link href="/admin/blogs/new" className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#151515] border border-admin-card hover:border-admin-accent transition-colors group">
              <FileText className="h-6 w-6 text-gray-400 group-hover:text-admin-accent mb-2 transition-colors" />
              <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">Write Article</span>
            </Link>
            
            <Link href="/admin/services/new" className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#151515] border border-admin-card hover:border-admin-accent transition-colors group">
              <Briefcase className="h-6 w-6 text-gray-400 group-hover:text-admin-accent mb-2 transition-colors" />
              <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">Add Service</span>
            </Link>
          </div>
          
          <Link href="/admin/settings" className="flex items-center justify-center p-4 rounded-lg bg-[#151515] border border-admin-card hover:border-admin-accent transition-colors group w-full">
            <Settings className="h-5 w-5 text-gray-400 group-hover:text-admin-accent mr-2 transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Update Global Settings</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
