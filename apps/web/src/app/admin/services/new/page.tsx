'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, ServiceInput } from '@hirelinks/contracts';
import { ServicesService } from '../../../../services/services.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { IconPicker } from '../../../../components/admin/common/IconPicker';
import { Button, Input } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import { ImageUploadPreview } from '../../../../components/admin/common/ImageUploadPreview';

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      steps: [],
      benefitItems: [],
      publishStatus: 'DRAFT',
      status: 'ACTIVE',
      isFeatured: false,
      displayOrder: 999
    }
  });

  const { register, control, handleSubmit, formState: { errors } } = form;

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps'
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefitItems'
  });

  const onSubmit = async (data: ServiceInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        primaryImage: primaryImageFile || undefined,
        secondaryImage: secondaryImageFile || undefined
      };
      
      const res = await ServicesService.createService(payload);
      if (res.success) {
        toast.success('Service created successfully');
        window.location.href = '/admin/services';
      } else {
        toast.error(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to create service');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPage 
      title="Create New Service" 
      description="Add a new service to the platform."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Service'}
        </Button>
      }
    >
      <div className="p-6">
        
          

          <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* General Info */}
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">General Info</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service Title *</label>
                <Input {...register('title')} placeholder="e.g. Corporate Talent Acquisition" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug (Optional)</label>
                <Input {...register('slug')} placeholder="Leave blank to auto-generate from title" />
                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Short Description *</label>
                <textarea 
                  {...register('shortDescription')} 
                  rows={3}
                  className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                  placeholder="Brief overview of the service (max 300 chars)..." 
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-admin-card">
                <div>
                  <ImageUploadPreview label="Primary Image" onImageChange={setPrimaryImageFile} />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primary Image Alt Text</label>
                    <Input {...register('primaryImageAlt')} placeholder="Describe the image..." />
                    {errors.primaryImageAlt && <p className="mt-1 text-xs text-red-600">{errors.primaryImageAlt.message}</p>}
                  </div>
                </div>
                <div>
                  <ImageUploadPreview label="Secondary Image" onImageChange={setSecondaryImageFile} />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Secondary Image Alt Text</label>
                    <Input {...register('secondaryImageAlt')} placeholder="Describe the image..." />
                    {errors.secondaryImageAlt && <p className="mt-1 text-xs text-red-600">{errors.secondaryImageAlt.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Process Steps</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Process Section Description</label>
                <textarea 
                  {...register('processDescription')} 
                  rows={2}
                  className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                  placeholder="Introductory text before the steps..." 
                />
                  {errors.processDescription && <p className="mt-1 text-xs text-red-600">{errors.processDescription?.message}</p>}
              </div>

              <div className="space-y-4 pt-4 border-t border-admin-card">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-white">Process Steps</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendStep({ title: '', displayOrder: 999 })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Step
                  </Button>
                </div>
                
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start p-4 bg-[#1D1D1D] rounded-lg border border-admin-card">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input {...register(`steps.${index}.title`)} placeholder="Step Title" />
                          {errors.steps?.[index]?.title && <p className="mt-1 text-xs text-red-600">{errors.steps[index]?.title?.message}</p>}
                        </div>
                        <div className="w-48">
                          <Controller
                            control={control}
                            name={`steps.${index}.icon`}
                            render={({ field }) => (
                              <IconPicker value={field.value || ''} onChange={field.onChange} />
                            )}
                          />
                        </div>
                        <div className="w-24">
                          <Input type="number" {...register(`steps.${index}.displayOrder`)} placeholder="Order" />
                          {errors.steps?.[index]?.displayOrder && <p className="mt-1 text-xs text-red-600">{errors.steps?.[index]?.displayOrder?.message}</p>}
                        </div>
                      </div>
                      <textarea 
                        {...register(`steps.${index}.description`)} 
                        rows={2}
                        className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                        placeholder="Step description..." 
                      />
                        {errors.steps?.[index]?.description && <p className="mt-1 text-xs text-red-600">{errors.steps?.[index]?.description?.message}</p>}
                    </div>
                    <button type="button" onClick={() => removeStep(index)} className="text-red-500 hover:text-red-700 mt-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Benefits</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Benefits Heading</label>
                <Input {...register('benefits.heading')} placeholder="e.g. Technical & Operational Benefits" />
                {errors.benefits?.heading && <p className="mt-1 text-xs text-red-600">{errors.benefits?.heading?.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Benefits Description</label>
                <textarea 
                  {...register('benefits.description')} 
                  rows={2}
                  className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                  placeholder="Introductory text before the benefit items..." 
                />
                  {errors.benefits?.description && <p className="mt-1 text-xs text-red-600">{errors.benefits?.description?.message}</p>}
              </div>

              <div className="space-y-4 pt-4 border-t border-admin-card">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-white">Benefit Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit({ heading: '', displayOrder: 999 })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Benefit
                  </Button>
                </div>
                
                {benefitFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start p-4 bg-[#18232c] rounded-lg border border-[#21353f]">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input {...register(`benefitItems.${index}.heading`)} placeholder="Benefit Heading" />
                          {errors.benefitItems?.[index]?.heading && <p className="mt-1 text-xs text-red-600">{errors.benefitItems[index]?.heading?.message}</p>}
                        </div>
                        <div className="w-24">
                          <Input type="number" {...register(`benefitItems.${index}.displayOrder`)} placeholder="Order" />
                          {errors.benefitItems?.[index]?.displayOrder && <p className="mt-1 text-xs text-red-600">{errors.benefitItems?.[index]?.displayOrder?.message}</p>}
                        </div>
                      </div>
                      <textarea 
                        {...register(`benefitItems.${index}.description`)} 
                        rows={2}
                        className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                        placeholder="Benefit description..." 
                      />
                        {errors.benefitItems?.[index]?.description && <p className="mt-1 text-xs text-red-600">{errors.benefitItems?.[index]?.description?.message}</p>}
                    </div>
                    <button type="button" onClick={() => removeBenefit(index)} className="text-red-500 hover:text-red-700 mt-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews & SEO */}
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Reviews & SEO</h2>
              <div className="p-4 bg-[#1D1D1D] border border-admin-card rounded-lg mb-6">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-white">Note:</span> Actual reviews are dynamically injected into the public service page based on the Reviews module.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Review Section Description</label>
                <textarea 
                  {...register('reviewSectionDescription')} 
                  rows={2}
                  className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                  placeholder="Text shown before the testimonials carousel..." 
                />
                  {errors.reviewSectionDescription && <p className="mt-1 text-xs text-red-600">{errors.reviewSectionDescription?.message}</p>}
              </div>

              <div className="pt-6 border-t border-admin-card space-y-4">
                <h3 className="text-sm font-medium text-white">SEO Settings</h3>
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
            </div>

            {/* Settings */}
            <div className="space-y-6 max-w-xl">
              <h2 className="text-lg font-semibold text-white border-b border-admin-card pb-2">Publish Settings</h2>
              <div className="flex flex-col gap-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 text-blue-600" />
                  {errors.isFeatured && <p className="mt-1 text-xs text-red-600">{errors.isFeatured?.message}</p>}
                  <div>
                    <div className="text-sm font-medium text-white">Feature on Homepage</div>
                    <div className="text-xs text-gray-400">Highlight this service in prime locations</div>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
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
