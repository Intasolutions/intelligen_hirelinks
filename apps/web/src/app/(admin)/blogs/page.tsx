'use client';

import { useState, useEffect } from 'react';
import { BlogsService } from '../../../services/blogs.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Plus, Search, Edit2, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await BlogsService.listBlogs({ search });
      if (res.success) {
        setBlogs(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const res = await BlogsService.deleteBlog(id);
      if (res.success) {
        toast.success('Blog deleted');
        fetchBlogs();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Unexpected error');
    }
  };

  return (
    <AdminPage 
      title="Blogs Management" 
      description="Manage platform blog articles and publications."
      actions={
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Blog
          </Button>
        </Link>
      }
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title, excerpt, or tags..." 
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
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Article Details</th>
                <th className="px-6 py-4 font-medium">Publish Status</th>
                <th className="px-6 py-4 font-medium">Active Status</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading blogs...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No blogs found.</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {blog.image?.url ? (
                        <img src={blog.image.url} alt="Blog Thumbnail" className="h-10 w-16 object-cover rounded-md border border-gray-200" />
                      ) : (
                        <div className="h-10 w-16 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{blog.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> /{blog.slug}
                      </div>
                      <div className="mt-1 flex gap-1 flex-wrap max-w-[200px]">
                        {blog.tags?.map((tag: string) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        blog.publishStatus === 'PUBLISHED' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' 
                        : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20'
                      }`}>
                        {blog.publishStatus}
                      </span>
                      {blog.publishedAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        blog.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                        : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {blog.isFeatured ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/${blog._id}`} className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(blog._id)} className="p-1 text-gray-400 hover:text-red-600">
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
