'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, ServiceInput } from '@hirelinks/contracts';
import { ServicesService } from '../../../../services/services.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      steps: [],
      benefitItems: [],
    }
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps'
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefitItems'
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await ServicesService.getServiceById(id);
        if (res.success && res.data) {
          reset(res.data);
        } else {
          toast.error('Failed to load service');
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id, reset]);

  const onSubmit = async (data: ServiceInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        primaryImage: primaryImageFile || undefined,
        secondaryImage: secondaryImageFile || undefined
      };
      
      const res = await ServicesService.updateService(id, payload);
      if (res.success) {
        toast.success('Service updated successfully');
        router.push('/admin/services');
      } else {
        toast.error(res.error || 'Failed to update service');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Edit Service">
        <div className="p-8 text-center text-gray-500">Loading service...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title="Edit Service" 
      description="Modify existing service content."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 overflow-x-auto whitespace-nowrap flex max-w-full justify-start w-max">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="process">Process Steps</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="reviews">Reviews & SEO</TabsTrigger>
            <TabsTrigger value="settings">Publish Settings</TabsTrigger>
          </TabsList>

          <form id="service-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* General Info */}
            <TabsContent value="general" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <Input {...register('title')} placeholder="e.g. Corporate Talent Acquisition" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea 
                  {...register('shortDescription')} 
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Brief overview of the service (max 300 chars)..." 
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image (Replace)</label>
                  <input type="file" accept="image/*" onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)} className="text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Image (Replace)</label>
                  <input type="file" accept="image/*" onChange={(e) => setSecondaryImageFile(e.target.files?.[0] || null)} className="text-sm" />
                </div>
              </div>
            </TabsContent>

            {/* Process Steps */}
            <TabsContent value="process" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Process Section Description</label>
                <textarea 
                  {...register('processDescription')} 
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Introductory text before the steps..." 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Process Steps</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendStep({ title: '', displayOrder: 999 })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Step
                  </Button>
                </div>
                
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input {...register(`steps.${index}.title`)} placeholder="Step Title" />
                          {errors.steps?.[index]?.title && <p className="mt-1 text-xs text-red-600">{errors.steps[index]?.title?.message}</p>}
                        </div>
                        <div className="w-32">
                          <Input {...register(`steps.${index}.icon`)} placeholder="Icon (e.g. Globe)" />
                        </div>
                        <div className="w-24">
                          <Input type="number" {...register(`steps.${index}.displayOrder`)} placeholder="Order" />
                        </div>
                      </div>
                      <textarea 
                        {...register(`steps.${index}.description`)} 
                        rows={2}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="Step description..." 
                      />
                    </div>
                    <button type="button" onClick={() => removeStep(index)} className="text-red-500 hover:text-red-700 mt-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Benefits */}
            <TabsContent value="benefits" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits Heading</label>
                <Input {...register('benefits.heading')} placeholder="e.g. Technical & Operational Benefits" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits Description</label>
                <textarea 
                  {...register('benefits.description')} 
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Introductory text before the benefit items..." 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Benefit Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit({ heading: '', displayOrder: 999 })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Benefit
                  </Button>
                </div>
                
                {benefitFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input {...register(`benefitItems.${index}.heading`)} placeholder="Benefit Heading" />
                          {errors.benefitItems?.[index]?.heading && <p className="mt-1 text-xs text-red-600">{errors.benefitItems[index]?.heading?.message}</p>}
                        </div>
                        <div className="w-24">
                          <Input type="number" {...register(`benefitItems.${index}.displayOrder`)} placeholder="Order" />
                        </div>
                      </div>
                      <textarea 
                        {...register(`benefitItems.${index}.description`)} 
                        rows={2}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="Benefit description..." 
                      />
                    </div>
                    <button type="button" onClick={() => removeBenefit(index)} className="text-red-500 hover:text-red-700 mt-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Reviews & SEO */}
            <TabsContent value="reviews" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Section Description</label>
                <textarea 
                  {...register('reviewSectionDescription')} 
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Text shown before the testimonials carousel..." 
                />
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">SEO Settings</h3>
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
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6 max-w-xl">
              <div className="flex flex-col gap-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Feature on Homepage</div>
                    <div className="text-xs text-gray-500">Highlight this service in prime locations</div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <Input type="number" {...register('displayOrder')} />
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
