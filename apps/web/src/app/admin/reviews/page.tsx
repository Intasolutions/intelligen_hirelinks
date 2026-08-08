'use client';

import { useState, useEffect } from 'react';
import { ReviewsService } from '../../../services/reviews.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [moderationStatus, setModerationStatus] = useState('All Moderation Status');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await ReviewsService.listReviews({ 
        search, 
        status: status !== 'All Status' ? status : undefined,
        moderationStatus: moderationStatus !== 'All Moderation Status' ? moderationStatus : undefined,
        page, 
        limit: 10 
      });
      if (res.success) {
        setReviews(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [search, status, moderationStatus, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await ReviewsService.deleteReview(id);
      if (res.success) {
        toast.success('Review deleted');
        fetchReviews();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Unexpected error');
    }
  };

  return (
    <AdminPage 
      title="Reviews & Testimonials" 
      description="Manage customer reviews, ratings, and moderation."
      actions={
        <Link href="/admin/reviews/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Review
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
              placeholder="Search reviews..." 
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
              value={moderationStatus}
              onChange={(e) => { setModerationStatus(e.target.value); setPage(1); }}
              className="h-10 rounded-md border border-admin-card bg-admin-bg px-4 text-sm text-gray-300 focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
            >
              <option value="All Moderation Status">All Moderation Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-admin-card">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-admin-card text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-card bg-admin-bg">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No reviews found.</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {review.customerPhoto?.url ? (
                        <img src={review.customerPhoto.url} alt={review.customerName} className="h-10 w-10 object-cover rounded-full border border-admin-card" />
                      ) : (
                        <div className="h-10 w-10 bg-admin-card flex items-center justify-center rounded-full border border-admin-card text-gray-300 font-medium text-sm">
                          {review.customerName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{review.customerName}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs mt-1">{review.reviewComment}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        {review.rating}/5
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        review.status === 'ACTIVE' && review.moderationStatus === 'APPROVED' ? 'bg-admin-accent/10 text-admin-accent' 
                        : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {review.moderationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {review.featureOnHomepage ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/reviews/${review._id}`} className="p-1 text-gray-400 hover:text-white bg-admin-card rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(review._id)} className="p-1 text-red-400 hover:text-red-300 bg-red-900/20 rounded transition-colors">
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
