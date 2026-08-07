'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogInput } from '@hirelinks/contracts';
import { BlogsService } from '../../../../services/blogs.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { TiptapEditor } from '../../../../components/admin/editor/TiptapEditor';
import { Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { X, Plus } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [tagInput, setTagInput] = useState('');

  const form = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      tags: [],
      content: '',
      publishStatus: 'DRAFT',
      status: 'ACTIVE',
      isFeatured: false,
      displayOrder: 999
    }
  });

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = form;
  const currentTags = watch('tags') || [];

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
      };
      
      const res = await BlogsService.createBlog(payload);
      if (res.success) {
        toast.success('Blog created successfully');
        router.push('/admin/blogs');
      } else {
        toast.error(res.error || 'Failed to create blog');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPage 
      title="Create New Blog" 
      description="Write a new article for the blog."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Blog'}
        </Button>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 overflow-x-auto whitespace-nowrap flex max-w-full justify-start w-max">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="article">Article Content</TabsTrigger>
            <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            <TabsTrigger value="settings">Publish Settings</TabsTrigger>
          </TabsList>

          <form id="blog-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* General Info */}
            <TabsContent value="general" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title *</label>
                <Input {...register('title')} placeholder="e.g. 5 Strategies for Success" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <Input {...register('subTitle')} placeholder="Optional brief sub-heading" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brief Excerpt Summary *</label>
                <textarea 
                  {...register('excerpt')} 
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Short summary used for blog cards and previews..." 
                />
                {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {currentTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-sm">
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

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm" />
              </div>
            </TabsContent>

            {/* Article Content */}
            <TabsContent value="article" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Article Content *</label>
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
            </TabsContent>

            {/* SEO Settings */}
            <TabsContent value="seo" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
                <Input {...register('seo.metaTitle')} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                <textarea 
                  {...register('seo.metaDescription')} 
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Keywords</label>
                <Input {...register('seo.keywords')} placeholder="comma, separated" />
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6 max-w-xl">
              <div className="flex flex-col gap-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Feature Blog</div>
                    <div className="text-xs text-gray-500">Highlight this article in featured sections</div>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Status</label>
                  <select {...register('publishStatus')} className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
                  <select {...register('status')} className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order (Optional)</label>
                  <Input type="number" {...register('displayOrder')} />
                  <p className="mt-1 text-xs text-gray-500">Normally blogs are ordered by publish date, use this for manual overriding.</p>
                </div>
              </div>
            </TabsContent>

          </form>
        </Tabs>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
