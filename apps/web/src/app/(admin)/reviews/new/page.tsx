'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewInput } from '@hirelinks/contracts';
import { ReviewsService } from '../../../../services/reviews.service';
import { ServicesService } from '../../../../services/services.service';
import { ProgramsService } from '../../../../services/programs.service';
import { AdminPage } from '../../../../components/admin/common/AdminPage';
import { Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';

export default function NewReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [linkedOptions, setLinkedOptions] = useState<any[]>([]);

  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      linkedType: 'SERVICE',
      moderationStatus: 'APPROVED',
      status: 'ACTIVE',
      featureOnHomepage: false,
      displayOrder: 999
    }
  });

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = form;
  const currentLinkedType = watch('linkedType');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (currentLinkedType === 'SERVICE') {
          const res = await ServicesService.listServices({ limit: 100 });
          setLinkedOptions(res.data || []);
        } else if (currentLinkedType === 'PROGRAM') {
          const res = await ProgramsService.listPrograms({ limit: 100 });
          setLinkedOptions(res.data || []);
        }
      } catch (e) {
        toast.error('Failed to load linked items');
      }
    };
    fetchOptions();
  }, [currentLinkedType]);

  const onSubmit = async (data: ReviewInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        image: imageFile || undefined,
      };
      
      const res = await ReviewsService.createReview(payload);
      if (res.success) {
        toast.success('Review created successfully');
        router.push('/admin/reviews');
      } else {
        toast.error(res.error || 'Failed to create review');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPage 
      title="Create New Review" 
      description="Add a new customer testimonial manually."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Review'}
        </Button>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="general">Testimonial Details</TabsTrigger>
            <TabsTrigger value="settings">Status & Settings</TabsTrigger>
          </TabsList>

          <form id="review-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* General Info */}
            <TabsContent value="general" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <Input {...register('customerName')} placeholder="e.g. John Doe" />
                {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5) *</label>
                <Input type="number" min={1} max={5} {...register('rating')} />
                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Comment *</label>
                <textarea 
                  {...register('reviewComment')} 
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Their testimonial..." 
                />
                {errors.reviewComment && <p className="mt-1 text-sm text-red-600">{errors.reviewComment.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Date (Optional)</label>
                <Input type="date" {...register('reviewDate')} />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm" />
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6 max-w-xl">
              <div className="flex flex-col gap-6">
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Linked Category</label>
                  <select {...register('linkedType')} className="h-10 w-full mb-3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none">
                    <option value="SERVICE">Service</option>
                    <option value="PROGRAM">Program</option>
                  </select>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-1">Linked Item *</label>
                  <select {...register('linkedItem')} className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none">
                    <option value="">-- Select {currentLinkedType} --</option>
                    {linkedOptions.map(opt => (
                      <option key={opt._id} value={opt._id}>{opt.title}</option>
                    ))}
                  </select>
                  {errors.linkedItem && <p className="mt-1 text-sm text-red-600">{errors.linkedItem.message}</p>}
                </div>

                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('featureOnHomepage')} className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Feature on Homepage</div>
                    <div className="text-xs text-gray-500">Highlight this review on the main landing page</div>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moderation Status</label>
                  <select {...register('moderationStatus')} className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none">
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
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
