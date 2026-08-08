'use client';

import { useState, useEffect } from 'react';
import { ServicesService } from '../../../services/services.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Plus, Search, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [publishStatus, setPublishStatus] = useState('All Publish Status');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await ServicesService.listServices({ 
        search, 
        status: status !== 'All Status' ? status : undefined,
        publishStatus: publishStatus !== 'All Publish Status' ? publishStatus : undefined,
        page, 
        limit: 10 
      });
      if (res.success) {
        setServices(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, status, publishStatus, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const res = await ServicesService.deleteService(id);
      if (res.success) {
        toast.success('Service deleted');
        fetchServices();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Unexpected error');
    }
  };

  return (
    <AdminPage 
      title="Services Management" 
      description="Manage platform services and detailed content pages."
      actions={
        <Link href="/admin/services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </Link>
      }
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-10 w-full rounded-md border border-admin-card bg-admin-bg pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-admin-card bg-admin-bg px-4 text-sm text-gray-300 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <select 
              value={publishStatus}
              onChange={(e) => { setPublishStatus(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-admin-card bg-admin-bg px-4 text-sm text-gray-300 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
            >
              <option value="All Publish Status">All Publish Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-admin-card">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-admin-card text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Service Name</th>
                <th className="px-6 py-4 font-medium">Publish Status</th>
                <th className="px-6 py-4 font-medium">Active Status</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-card bg-admin-bg">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading services...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No services found.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{service.title}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> /{service.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        service.publishStatus === 'PUBLISHED' ? 'bg-admin-accent/10 text-admin-accent' 
                        : 'bg-gray-800 text-gray-400'
                      }`}>
                        {service.publishStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        service.status === 'ACTIVE' ? 'bg-admin-accent/10 text-admin-accent' 
                        : 'bg-red-500/10 text-red-400'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {service.isFeatured ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/services/${service._id}`} className="p-1 text-gray-400 hover:text-white bg-admin-card rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(service._id)} className="p-1 text-red-400 hover:text-red-300 bg-red-900/20 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border border-admin-card bg-admin-bg px-4 py-3 sm:px-6 mt-4 rounded-md">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm" className="bg-[#252525] border-admin-card text-white hover:bg-admin-card">Previous</Button>
              <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} variant="outline" size="sm" className="bg-[#252525] border-admin-card text-white hover:bg-admin-card">Next</Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages || 1}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm" className="rounded-l-md rounded-r-none bg-[#252525] border-admin-card text-white hover:bg-admin-card">Previous</Button>
                  <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} variant="outline" size="sm" className="rounded-l-none rounded-r-md bg-[#252525] border-admin-card text-white hover:bg-admin-card">Next</Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
