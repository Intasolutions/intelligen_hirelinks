'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsInput } from '@hirelinks/contracts';
import { SettingsService } from '../../../services/settings.service';
import { AdminPage } from '../../../components/admin/common/AdminPage';
import { Button, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { ImageUploadPreview } from '../../../components/admin/common/ImageUploadPreview';


export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      robotsIndex: true,
      robotsFollow: true,
      addresses: []
    }
  });

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = form;

  // The four image pickers below live outside react-hook-form (they hold a
  // raw File, not a form field), so choosing an image never touches the
  // form's own isDirty flag — Save stayed disabled even after picking a
  // new logo/favicon/OG image because nothing else had changed. Tracking
  // whether any file was chosen separately, and OR-ing it into the
  // disabled check below, is what actually reflects "there's something
  // pending to save."
  const hasPendingImage = Boolean(logoFile || darkLogoFile || faviconFile || ogImageFile);

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control,
    name: 'addresses'
  });

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
      const payload = {
        ...data,
        logo: logoFile || data.logo,
        darkLogo: darkLogoFile || data.darkLogo,
        favicon: faviconFile || data.favicon,
        defaultOgImage: ogImageFile || data.defaultOgImage
      };
      const res = await SettingsService.updateSettings(payload);
      if (res.success) {
        toast.success('Settings updated successfully');
        reset(data); // reset dirty state
        setLogoFile(null);
        setDarkLogoFile(null);
        setFaviconFile(null);
        setOgImageFile(null);
      } else {
        toast.error(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to update settings');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  };

  if (isLoading) {
    return (
      <AdminPage title="Global Settings">
        <div className="p-8 text-center text-gray-400">Loading settings...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage 
      title="Global Settings" 
      description="Manage all platform-wide configurations, branding, and defaults."
      actions={
        <Button onClick={handleSubmit(onSubmit)} disabled={(!isDirty && !hasPendingImage) || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 overflow-x-auto whitespace-nowrap flex max-w-full justify-start w-max">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
          </TabsList>

          <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
            
            <TabsContent value="general" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company Name *</label>
                <Input {...register('companyName')} placeholder="Acme Inc." />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company Email *</label>
                <Input type="email" {...register('companyEmail')} placeholder="hello@acme.com" />
                {errors.companyEmail && <p className="mt-1 text-sm text-red-600">{errors.companyEmail.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <Input {...register('companyPhone')} placeholder="+1 (555) 000-0000" />
                  {errors.companyPhone && <p className="mt-1 text-xs text-red-600">{errors.companyPhone?.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp</label>
                  <Input {...register('companyWhatsapp')} placeholder="+1 (555) 000-0000" />
                  {errors.companyWhatsapp && <p className="mt-1 text-xs text-red-600">{errors.companyWhatsapp?.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Hours</label>
                <Input {...register('businessHours')} placeholder="Mon-Fri, 9am - 5pm EST" />
                {errors.businessHours && <p className="mt-1 text-xs text-red-600">{errors.businessHours?.message}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">Office Addresses</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendAddress({ address: '', isPrimary: false })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Address
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {addressFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 bg-[#1D1D1D] p-3 rounded-md border border-admin-card">
                      <div className="flex-1 space-y-3">
                        <textarea 
                          {...register(`addresses.${index}.address`)}
                          rows={2}
                          className="w-full rounded-md border border-admin-card bg-admin-bg p-2 text-sm text-white focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                          placeholder="Full address..."
                        />
                        {errors.addresses?.[index]?.address && <p className="text-xs text-red-600">{errors.addresses[index]?.address?.message}</p>}
                        
                        <label className="flex items-center gap-2">
                          <input type="checkbox" {...register(`addresses.${index}.isPrimary`)} />
                          {errors.addresses?.[index]?.isPrimary && <p className="mt-1 text-xs text-red-600">{errors.addresses?.[index]?.isPrimary?.message}</p>}
                          <span className="text-xs text-gray-400">Set as Primary Address</span>
                        </label>
                      </div>
                      <button type="button" onClick={() => removeAddress(index)} className="text-red-500 hover:text-red-700 mt-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {addressFields.length === 0 && <p className="text-sm text-gray-500">No addresses added yet.</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Light Logo</label>
                <ImageUploadPreview 
                  label=""
                  initialImageUrl={form.getValues('logo')}
                  onImageChange={setLogoFile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Dark Logo</label>
                <ImageUploadPreview 
                  label=""
                  initialImageUrl={form.getValues('darkLogo')}
                  onImageChange={setDarkLogoFile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Favicon</label>
                <ImageUploadPreview 
                  label=""
                  initialImageUrl={form.getValues('favicon')}
                  onImageChange={setFaviconFile}
                />
              </div>
            </TabsContent>


            <TabsContent value="social" className="space-y-6 max-w-2xl">
              {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'threads'].map((social) => (
                <div key={social}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{social}</label>
                  <Input {...register(social as any)} placeholder={`https://${social}.com/...`} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default Meta Title</label>
                <Input {...register('defaultMetaTitle')} />
                {errors.defaultMetaTitle && <p className="mt-1 text-xs text-red-600">{errors.defaultMetaTitle?.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default Meta Description</label>
                <Input {...register('defaultMetaDescription')} />
                {errors.defaultMetaDescription && <p className="mt-1 text-xs text-red-600">{errors.defaultMetaDescription?.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default Keywords</label>
                <Input {...register('defaultKeywords')} placeholder="comma, separated, keywords" />
                {errors.defaultKeywords && <p className="mt-1 text-xs text-red-600">{errors.defaultKeywords?.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default Canonical URL</label>
                <Input {...register('defaultCanonical')} placeholder="https://yourdomain.com" />
                {errors.defaultCanonical && <p className="mt-1 text-xs text-red-600">{errors.defaultCanonical?.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default OpenGraph Image</label>
                <ImageUploadPreview 
                  label=""
                  initialImageUrl={form.getValues('defaultOgImage')}
                  onImageChange={setOgImageFile}
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('robotsIndex')} />
                  {errors.robotsIndex && <p className="mt-1 text-xs text-red-600">{errors.robotsIndex?.message}</p>}
                  <span className="text-sm text-gray-300">Allow Indexing (robotsIndex)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('robotsFollow')} />
                  {errors.robotsFollow && <p className="mt-1 text-xs text-red-600">{errors.robotsFollow?.message}</p>}
                  <span className="text-sm text-gray-300">Allow Following (robotsFollow)</span>
                </label>
              </div>
            </TabsContent>

          </form>
        </Tabs>
      </div>
      <Toaster position="top-right" />
    </AdminPage>
  );
}
