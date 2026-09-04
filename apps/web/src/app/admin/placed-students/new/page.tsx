'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { placedStudentSchema, PlacedStudentInput } from '@hirelinks/contracts';
import { PlacedStudentsService } from '../../../../services/placed-students.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { Button, Input } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { ImageUploadPreview } from '../../../../components/admin/common/ImageUploadPreview';
import { CROP_TARGETS } from '../../../../lib/crop-targets';

export default function NewPlacedStudentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<PlacedStudentInput>({
    resolver: zodResolver(placedStudentSchema),
    defaultValues: {
      status: 'ACTIVE',
      displayOrder: 999
    }
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: PlacedStudentInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        image: imageFile || undefined,
      };

      const res = await PlacedStudentsService.createPlacedStudent(payload);
      if (res.success) {
        toast.success('Placed student created successfully');
        window.location.href = '/admin/placed-students';
      } else {
        toast.error(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to create placed student');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPage
      title="Add Placed Student"
      description="Add a new student to feature in the About page carousel."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Student'}
        </Button>
      }
    >
      <div className="p-6">
        <form id="placed-student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Student Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
              <Input {...register('name')} placeholder="e.g. Catherine Meg" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Program (Optional)</label>
              <Input {...register('program')} placeholder="e.g. MBBS, Nursing" />
              {errors.program && <p className="mt-1 text-xs text-red-600">{errors.program?.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Country (Optional)</label>
              <Input {...register('country')} placeholder="e.g. USA" />
              {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country?.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Country Code (Optional)</label>
              <Input {...register('countryCode')} placeholder="e.g. us (ISO 3166-1 alpha-2, used for the flag icon)" maxLength={2} />
              {errors.countryCode && <p className="mt-1 text-xs text-red-600">{errors.countryCode?.message}</p>}
            </div>

            <div className="pt-4 border-t border-admin-card">
              <ImageUploadPreview
                label="Student Photo"
                onImageChange={setImageFile}
                cropTarget={CROP_TARGETS.studentPhoto}
              />
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Status & Settings</h2>
            <div className="flex flex-col gap-6">
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
          </div>

        </form>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
