'use client';

import { useState, useEffect } from 'react';
import { ContactsService } from '../../../services/contacts.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Search, Eye, Filter } from 'lucide-react';
import Link from 'next/link';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [type, setType] = useState('All Types');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStats = async () => {
    try {
      const res = await ContactsService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await ContactsService.listContacts({ search, status, type, page, limit: 10 });
      if (res.success) {
        setEnquiries(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [search, status, type, page]);

  return (
    <AdminPage 
      title="Lead Enquiries" 
      description="Manage incoming academy registrations and consultation requests."
    >
      <div className="p-6">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-admin-bg border border-admin-card rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400">Total Leads</h3>
            <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-admin-bg border border-admin-card rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400">Pending</h3>
            <p className="mt-2 text-3xl font-bold text-admin-accent">{stats.pending}</p>
          </div>
          <div className="bg-admin-bg border border-admin-card rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400">In Progress</h3>
            <p className="mt-2 text-3xl font-bold text-blue-400">{stats.inProgress}</p>
          </div>
          <div className="bg-admin-bg border border-admin-card rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400">Resolved</h3>
            <p className="mt-2 text-3xl font-bold text-green-400">{stats.resolved}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-10 w-full rounded-md border border-admin-card bg-admin-bg pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <select 
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="h-10 appearance-none rounded-md border border-admin-card bg-admin-bg pl-4 pr-10 text-sm text-gray-300 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
              >
                <option value="All Status">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(1); }}
                className="h-10 appearance-none rounded-md border border-admin-card bg-admin-bg pl-4 pr-10 text-sm text-gray-300 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
              >
                <option value="All Types">All Types</option>
                <option value="REGISTRATION">Registration</option>
                <option value="CONTACT">Contact</option>
              </select>
              <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-md border border-admin-card">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-admin-card text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Name / Contact</th>
                <th className="px-6 py-4 font-medium">Type / Source</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-card bg-admin-bg">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading enquiries...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No enquiries found.</td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{enq.fullName}</div>
                      <div className="text-xs text-gray-400 mt-1">{enq.email}</div>
                      <div className="text-xs text-gray-400">{enq.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white capitalize">{enq.source.toLowerCase()}</div>
                      <div className="text-xs text-gray-400 mt-1">Source: {enq.source === 'REGISTRATION' ? 'Registration Form' : 'Contact Form'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">
                        {new Date(enq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        enq.status === 'PENDING' ? 'bg-admin-accent/10 text-admin-accent' 
                        : enq.status === 'IN_PROGRESS' ? 'bg-[#18232c]0/10 text-blue-400'
                        : 'bg-green-500/10 text-green-400'
                      }`}>
                        {enq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/enquiries/${enq._id}`} className="inline-flex items-center gap-2 text-sm text-admin-accent hover:text-white transition-colors bg-admin-card px-3 py-1.5 rounded-md">
                        <Eye className="h-4 w-4" /> View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
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
