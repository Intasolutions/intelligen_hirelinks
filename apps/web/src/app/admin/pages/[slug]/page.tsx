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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ImageUploadPreview } from '../../../../components/admin/common/ImageUploadPreview';
import { CROP_TARGETS } from '../../../../lib/crop-targets';

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
            <Button variant="outline" className="bg-[#252525] border-admin-card text-white hover:bg-admin-card">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <form id="page-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          {/* Page Details */}
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Page Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Page Title *</label>
              <Input {...register('title')} placeholder="e.g. Privacy Policy" />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug (Optional)</label>
              <Input {...register('slug')} placeholder="Leave blank to auto-generate from title" />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
            </div>

            <div className="pt-4 border-t border-admin-card">
              <ImageUploadPreview
                label="Optional Cover Image"
                initialImageUrl={existingImage}
                onImageChange={(file) => {
                  setImageFile(file);
                  setRemoveImage(!file && !!existingImage);
                }}
                cropTarget={CROP_TARGETS.pageCoverImage}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Image Alt Text</label>
                <Input {...register('imageAlt')} placeholder="Describe the image..." />
                {errors.imageAlt && <p className="mt-1 text-xs text-red-600">{errors.imageAlt.message}</p>}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Detailed Content *</h2>
            <p className="text-xs text-gray-400">There is no character limit. Write your complete legal document below.</p>
            {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}

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

          {/* SEO Settings */}
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">SEO Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Meta Title</label>
              <Input {...register('seo.metaTitle')} />
              {errors.seo?.metaTitle && <p className="mt-1 text-xs text-red-600">{errors.seo?.metaTitle?.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Meta Description</label>
              <textarea
                {...register('seo.metaDescription')}
                rows={2}
                className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
              />
              {errors.seo?.metaDescription && <p className="mt-1 text-xs text-red-600">{errors.seo?.metaDescription?.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Keywords</label>
              <Input {...register('seo.keywords')} placeholder="comma, separated" />
              {errors.seo?.keywords && <p className="mt-1 text-xs text-red-600">{errors.seo?.keywords?.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Canonical URL</label>
              <Input {...register('seo.canonicalUrl')} placeholder="https://yourdomain.com/page" />
              {errors.seo?.canonicalUrl && <p className="mt-1 text-xs text-red-600">{errors.seo?.canonicalUrl?.message}</p>}
            </div>
          </div>

        </form>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
