import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Activity, Server, Clock, Database } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';

export const metadata = {
  title: 'Admin Home - CMS'
};

export default async function DashboardPage() {
  let healthData = null;
  let errorMsg = null;

  try {
    const res = await apiClient<{ status: string; uptime: number; version: string; database: { connected: boolean } }>('/health');
    healthData = res.data;
  } catch (error: any) {
    errorMsg = error.message;
  }

  return (
    <AdminPage 
      title="Admin Home" 
      description="Welcome to the Intelligen CMS platform."
    >
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">System Status</h3>
        
        {errorMsg ? (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm font-medium text-red-800">API Connection Failed</p>
            <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
          </div>
        ) : healthData ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-md">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium truncate text-gray-500">API Status</dt>
                    <dd className="text-lg font-semibold text-gray-900 uppercase">{healthData.status}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-md">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium truncate text-gray-500">Database</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {healthData.database.connected ? 'Connected' : 'Disconnected'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-md">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium truncate text-gray-500">Version</dt>
                    <dd className="text-lg font-semibold text-gray-900">v{healthData.version}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-100 p-3 rounded-md">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium truncate text-gray-500">Uptime</dt>
                    <dd className="text-lg font-semibold text-gray-900">{Math.floor(healthData.uptime)}s</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-32 w-full animate-pulse bg-gray-100 rounded-lg"></div>
        )}

        <div className="mt-10 border-t border-gray-100 pt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
          <p className="text-sm text-gray-500 italic">No business modules installed yet. Please proceed to the next phase.</p>
        </div>
      </div>
    </AdminPage>
  );
}
