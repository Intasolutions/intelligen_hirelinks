'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsInput } from '@hirelinks/contracts';
import { SettingsService } from '../../../services/settings.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      robotsIndex: true,
      robotsFollow: true,
    }
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = form;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await SettingsService.getSettings();
        if (res.success && res.data) {
          reset(res.data);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsInput) => {
    try {
      const res = await SettingsService.updateSettings(data);
      if (res.success) {
        toast.success('Settings updated successfully');
        reset(data); // reset dirty state
      } else {
        toast.error(res.error || 'Failed to update settings');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Global Settings">
        <div className="p-8 text-center text-gray-500">Loading settings...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title="Global Settings" 
      description="Manage all platform-wide configurations, branding, and defaults."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 overflow-x-auto whitespace-nowrap flex max-w-full justify-start w-max">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
            
            <TabsContent value="general" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <Input {...register('companyName')} placeholder="Acme Inc." />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Email *</label>
                <Input type="email" {...register('companyEmail')} placeholder="hello@acme.com" />
                {errors.companyEmail && <p className="mt-1 text-sm text-red-600">{errors.companyEmail.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input {...register('companyPhone')} placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <Input {...register('companyWhatsapp')} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                <Input {...register('businessHours')} placeholder="Mon-Fri, 9am - 5pm EST" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input {...register('companyAddress')} placeholder="123 Main St, New York, NY" />
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6 max-w-2xl">
              <div className="rounded-md bg-blue-50 p-4 mb-6">
                <p className="text-sm text-blue-700">Note: Currently using URL strings. Phase 5 Media Engine will replace these with media pickers.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Light Logo URL</label>
                <Input {...register('logo')} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dark Logo URL</label>
                <Input {...register('darkLogo')} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <Input {...register('favicon')} placeholder="https://..." />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                <Input {...register('googleMapEmbed')} placeholder="<iframe src='...' />" />
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 max-w-2xl">
              {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'threads'].map((social) => (
                <div key={social}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{social}</label>
                  <Input {...register(social as any)} placeholder={`https://${social}.com/...`} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Title</label>
                <Input {...register('defaultMetaTitle')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Description</label>
                <Input {...register('defaultMetaDescription')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Keywords</label>
                <Input {...register('defaultKeywords')} placeholder="comma, separated, keywords" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Canonical URL</label>
                <Input {...register('defaultCanonical')} placeholder="https://yourdomain.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default OpenGraph Image URL</label>
                <Input {...register('defaultOgImage')} placeholder="https://..." />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('robotsIndex')} />
                  <span className="text-sm text-gray-700">Allow Indexing (robotsIndex)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('robotsFollow')} />
                  <span className="text-sm text-gray-700">Allow Following (robotsFollow)</span>
                </label>
              </div>
            </TabsContent>

            <TabsContent value="footer" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                <Input {...register('copyright')} placeholder="© 2026 Acme Inc. All rights reserved." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
                <Input {...register('footerDescription')} placeholder="Brief description for the footer area." />
              </div>
            </TabsContent>

          </form>
        </Tabs>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
