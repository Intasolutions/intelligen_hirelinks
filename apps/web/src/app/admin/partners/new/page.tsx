'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerLogoSchema, PartnerLogoInput } from '@hirelinks/contracts';
import { PartnerLogosService } from '../../../../services/partner-logos.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { Button, Input } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { ImageUploadPreview } from '../../../../components/admin/common/ImageUploadPreview';

export default function NewPartnerLogoPage() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as PartnerLogoInput['category']) || 'DOMESTIC';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const form = useForm<PartnerLogoInput>({
    resolver: zodResolver(partnerLogoSchema),
    defaultValues: {
      category: initialCategory,
      status: 'ACTIVE',
      displayOrder: 999,
    }
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: PartnerLogoInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        logo: logoFile || undefined,
      };

      const res = await PartnerLogosService.createPartnerLogo(payload);
      if (res.success) {
        toast.success('Logo created successfully');
        window.location.href = '/admin/partners';
      } else {
        toast.error(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to create logo');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPage
      title="Add Partner / Certification Logo"
      description="Add a new domestic partner, international partner, or certification logo."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Logo'}
        </Button>
      }
    >
      <div className="p-6">
        <form id="partner-logo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-2xl">

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Logo Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
              <Input {...register('name')} placeholder="e.g. Apollo Hospitals" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <select {...register('category')} className="h-10 w-full rounded-md border border-admin-card bg-admin-bg px-3 py-2 text-sm text-white focus:border-admin-accent focus:outline-none">
                <option value="DOMESTIC">Domestic Partner</option>
                <option value="INTERNATIONAL">International Partner</option>
                <option value="CERTIFICATION">Certification / Affiliation</option>
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category?.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Website URL (Optional)</label>
              <Input {...register('websiteUrl')} placeholder="https://example.com" />
              {errors.websiteUrl && <p className="mt-1 text-xs text-red-600">{errors.websiteUrl?.message}</p>}
            </div>

            <div className="pt-4 border-t border-admin-card">
              <ImageUploadPreview
                label="Logo Image"
                onImageChange={setLogoFile}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Status & Settings</h2>

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
            </div>
          </div>

        </form>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
