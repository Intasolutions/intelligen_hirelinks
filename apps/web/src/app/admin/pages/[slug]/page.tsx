'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageSchema, PageInput } from '@hirelinks/contracts';
import { PagesService } from '../../../../services/pages.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { TiptapEditor } from '../../../../components/admin/editor/TiptapEditor';
import { Button, Input } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ImageUploadPreview } from '../../../../components/admin/common/ImageUploadPreview';

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const form = useForm<PageInput>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      content: '',
      title: ''
    }
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await PagesService.getPage(slug);
        if (res.success && res.data) {
          reset(res.data);
          setExistingImage(res.data.image?.url || null);
        } else {
          toast.error('Failed to load page');
          window.location.href = '/admin/pages';
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
        window.location.href = '/admin/pages';
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
  }, [slug, reset, router]);

  const onSubmit = async (data: PageInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        image: imageFile || undefined,
        removeImage
      };
      
      const res = await PagesService.updatePage(slug, payload);
      if (res.success) {
        toast.success('Page updated successfully');
        window.location.href = '/admin/pages';
      } else {
        toast.error(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to update page');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Edit Page">
        <div className="p-8 text-center text-gray-400">Loading page...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title={`Edit Page: ${slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms & Conditions'}`}
      description="Manage the content for this legal page."
      actions={
        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          </Link>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <form id="page-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
          
          <div className="bg-white p-6 rounded-md border border-admin-card">
            <h3 className="text-lg font-medium text-white mb-4">Page Details</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Page Title *</label>
              <Input {...register('title')} placeholder="e.g. Privacy Policy" />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="border-t border-admin-card pt-4">
              <ImageUploadPreview 
                label="Optional Cover Image"
                initialImageUrl={existingImage}
                onImageChange={(file) => {
                  setImageFile(file);
                  setRemoveImage(!file && !!existingImage);
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border border-admin-card">
            <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Content *</label>
            <p className="text-xs text-gray-400 mb-4">There is no character limit. Write your complete legal document below.</p>
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

        </form>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
