'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { programSchema, ProgramInput } from '@hirelinks/contracts';
import { ProgramsService } from '../../../../services/programs.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Trash2, Plus, X } from 'lucide-react';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);

  // Added flags for removing images explicitly
  const [removePrimaryImage, setRemovePrimaryImage] = useState(false);
  const [removeSecondaryImage, setRemoveSecondaryImage] = useState(false);
  
  // To show existing images
  const [existingPrimary, setExistingPrimary] = useState<string | null>(null);
  const [existingSecondary, setExistingSecondary] = useState<string | null>(null);

  const form = useForm<ProgramInput>({
    resolver: zodResolver(programSchema),
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
    const fetchProgram = async () => {
      try {
        const res = await ProgramsService.getProgramById(id);
        if (res.success && res.data) {
          reset(res.data);
          setExistingPrimary(res.data.primaryImage?.url || null);
          setExistingSecondary(res.data.secondaryImage?.url || null);
        } else {
          toast.error('Failed to load program');
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgram();
  }, [id, reset]);

  const onSubmit = async (data: ProgramInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        primaryImage: primaryImageFile || undefined,
        secondaryImage: secondaryImageFile || undefined,
        removePrimaryImage,
        removeSecondaryImage
      };
      
      const res = await ProgramsService.updateProgram(id, payload);
      if (res.success) {
        toast.success('Program updated successfully');
        router.push('/admin/programs');
      } else {
        toast.error(res.error || 'Failed to update program');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Edit Program">
        <div className="p-8 text-center text-gray-500">Loading program...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title="Edit Program" 
      description="Modify existing program content."
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

          <form id="program-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* General Info */}
            <TabsContent value="general" className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Title *</label>
                <Input {...register('title')} placeholder="e.g. Leadership Excellence Program" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea 
                  {...register('shortDescription')} 
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Brief overview of the program (max 300 chars)..." 
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image</label>
                  {!removePrimaryImage && existingPrimary && !primaryImageFile ? (
                    <div className="mb-2 relative inline-block">
                      <img src={existingPrimary} alt="Primary" className="h-24 w-40 object-cover rounded-md border border-gray-200" />
                      <button 
                        type="button" 
                        onClick={() => setRemovePrimaryImage(true)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                  <input type="file" accept="image/*" onChange={(e) => {
                    setPrimaryImageFile(e.target.files?.[0] || null);
                    setRemovePrimaryImage(false); // If they upload a new one, don't remove, just replace
                  }} className="text-sm" />
                  {removePrimaryImage && <p className="text-xs text-orange-600 mt-1">Image will be removed upon save.</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Image</label>
                  {!removeSecondaryImage && existingSecondary && !secondaryImageFile ? (
                    <div className="mb-2 relative inline-block">
                      <img src={existingSecondary} alt="Secondary" className="h-24 w-40 object-cover rounded-md border border-gray-200" />
                      <button 
                        type="button" 
                        onClick={() => setRemoveSecondaryImage(true)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                  <input type="file" accept="image/*" onChange={(e) => {
                    setSecondaryImageFile(e.target.files?.[0] || null);
                    setRemoveSecondaryImage(false);
                  }} className="text-sm" />
                  {removeSecondaryImage && <p className="text-xs text-orange-600 mt-1">Image will be removed upon save.</p>}
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
                    <div className="text-xs text-gray-500">Highlight this program in prime locations</div>
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
