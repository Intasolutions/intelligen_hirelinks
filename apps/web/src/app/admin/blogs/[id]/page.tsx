'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogInput } from '@hirelinks/contracts';
import { BlogsService } from '../../../../services/blogs.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { TiptapEditor } from '../../../../components/admin/editor/TiptapEditor';
import { Button, Input } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { X } from 'lucide-react';
import { ImageUploadPreview } from '../../../../components/admin/common/ImageUploadPreview';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  const [tagInput, setTagInput] = useState('');

  const form = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      tags: [],
      content: '' }
  });

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = form;
  const currentTags = watch('tags') || [];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await BlogsService.getBlogById(id);
        if (res.success && res.data) {
          reset(res.data);
          setExistingImage(res.data.image?.url || null);
        } else {
          toast.error('Failed to load blog');
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id, reset]);

  const handleAddTag = () => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', currentTags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: BlogInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        image: imageFile || undefined,
        removeImage
      };
      
      const res = await BlogsService.updateBlog(id, payload);
      if (res.success) {
        toast.success('Blog updated successfully');
        window.location.href = '/admin/blogs';
      } else {
        toast.error(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to update blog');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Edit Blog">
        <div className="p-8 text-center text-gray-400">Loading blog...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title="Edit Blog" 
      description="Update existing blog article."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      }
    >
      <div className="p-6">
        
          

          <form id="blog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* General Info */}
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">General</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Blog Title *</label>
                <Input {...register('title')} placeholder="e.g. 5 Strategies for Success" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
                <Input {...register('subTitle')} placeholder="Optional brief sub-heading" />
                {errors.subTitle && <p className="mt-1 text-xs text-red-600">{errors.subTitle?.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Brief Excerpt Summary *</label>
                <textarea 
                  {...register('excerpt')} 
                  rows={3}
                  className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                  placeholder="Short summary used for blog cards and previews..." 
                />
                {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {currentTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-300 px-2.5 py-1 rounded-md text-sm">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add a tag (press Enter)"
                    className="max-w-xs"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>Add Tag</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-admin-card">
                <label className="block text-sm font-medium text-gray-300 mb-1">Blog Image</label>
                {!removeImage && existingImage && !imageFile ? (
                  <div className="mb-2 relative inline-block">
                    <img src={existingImage} alt="Blog cover" className="h-24 w-40 object-cover rounded-md border border-admin-card" />
                    <button 
                      type="button" 
                      onClick={() => setRemoveImage(true)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={(e) => {
                  setImageFile(e.target.files?.[0] || null);
                  setRemoveImage(false);
                }} className="text-sm" />
                {removeImage && <p className="text-xs text-orange-600 mt-1">Image will be removed upon save.</p>}
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Article Content</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Detailed Article Content *</label>
                {errors.content && <p className="mb-2 text-sm text-red-600">{errors.content.message}</p>}
                
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <TiptapEditor 
                      content={field.value} 
                      onChange={field.onChange} 
                    />
                  )}
                />
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">SEO Settings</h2>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Meta Title</label>
                <Input {...register('seo.metaTitle')} />
                {errors.seo?.metaTitle && <p className="mt-1 text-xs text-red-600">{errors.seo?.metaTitle?.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Meta Description</label>
                <textarea 
                  {...register('seo.metaDescription')} 
                  rows={2}
                  className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                />
                  {errors.seo?.metaDescription && <p className="mt-1 text-xs text-red-600">{errors.seo?.metaDescription?.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Keywords</label>
                <Input {...register('seo.keywords')} placeholder="comma, separated" />
                {errors.seo?.keywords && <p className="mt-1 text-xs text-red-600">{errors.seo?.keywords?.message}</p>}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6 max-w-xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Publish Settings</h2>
              <div className="flex flex-col gap-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 text-blue-600" />
                  {errors.isFeatured && <p className="mt-1 text-xs text-red-600">{errors.isFeatured?.message}</p>}
                  <div>
                    <div className="text-sm font-medium text-white">Feature Blog</div>
                    <div className="text-xs text-gray-400">Highlight this article in featured sections</div>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Publish Status</label>
                  <select {...register('publishStatus')} className="h-10 w-full rounded-md border border-admin-card bg-admin-bg px-3 py-2 text-sm text-white focus:border-admin-accent focus:outline-none">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                  {errors.publishStatus && <p className="mt-1 text-xs text-red-600">{errors.publishStatus?.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Active Status</label>
                  <select {...register('status')} className="h-10 w-full rounded-md border border-admin-card bg-admin-bg px-3 py-2 text-sm text-white focus:border-admin-accent focus:outline-none">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status?.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Display Order (Optional)</label>
                  <Input type="number" {...register('displayOrder')} />
                  {errors.displayOrder && <p className="mt-1 text-xs text-red-600">{errors.displayOrder?.message}</p>}
                  <p className="mt-1 text-xs text-gray-400">Normally blogs are ordered by publish date, use this for manual overriding.</p>
                </div>
              </div>
            </div>

          </form>
        
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
