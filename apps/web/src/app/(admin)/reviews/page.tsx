'use client';

import { useState, useEffect } from 'react';
import { ReviewsService } from '../../../services/reviews.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Plus, Search, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await ReviewsService.listReviews({ search });
      if (res.success) {
        setReviews(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [search]);

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
        <Button onClick={() => toast.info('Add Review drawer coming soon!')}>
          <Plus className="mr-2 h-4 w-4" /> Add Review
        </Button>
      }
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No reviews found.</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{review.customerName}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs mt-1">{review.reviewComment}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        {review.rating}/5
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        review.status === 'ACTIVE' && review.moderationStatus === 'APPROVED' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                        : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                      }`}>
                        {review.moderationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {review.featureOnHomepage ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(review._id)} className="p-1 text-gray-400 hover:text-red-600">
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
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
