'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactInput } from '@hirelinks/contracts';
import { ContactsService } from '../../services/contacts.service';
import { Button } from '@hirelinks/ui';
import { toast, Toaster } from 'sonner';
import { Check } from 'lucide-react';

const QUALIFICATIONS = ['GNM', 'B.Sc Nursing', 'Post B.Sc', 'M.Sc', 'Other'];
const EXPERIENCES = ['Fresher', '0–1 yr', '1–3 yrs', '3–5 yrs', '5+ yrs'];

export const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      qualifications: [],
      experience: [],
      source: 'REGISTRATION'
    }
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const res = await ContactsService.createPublic(data);
      if (res.success) {
        setIsSuccess(true);
        reset();
      } else {
        toast.error('Registration failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for registering with Intelligen Academy. Our team has received your details and will get in touch with you shortly.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Submit Another Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Now!</h2>
        <p className="text-gray-600">Fill in your details below to start your journey with us.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Personal Details (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              type="text" 
              {...register('fullName')} 
              className={`w-full h-11 rounded-md border px-4 focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input 
              type="tel" 
              {...register('phoneNumber')} 
              className={`w-full h-11 rounded-md border px-4 focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input 
              type="tel" 
              {...register('whatsappNumber')} 
              className="w-full h-11 rounded-md border border-gray-300 px-4 focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none transition-all"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              type="email" 
              {...register('email')} 
              className={`w-full h-11 rounded-md border px-4 focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
            <input 
              type="text" 
              {...register('nationality')} 
              className={`w-full h-11 rounded-md border px-4 focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none transition-all ${errors.nationality ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Indian"
            />
            {errors.nationality && <p className="mt-1 text-xs text-red-500">{errors.nationality.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place *</label>
            <input 
              type="text" 
              {...register('place')} 
              className={`w-full h-11 rounded-md border px-4 focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none transition-all ${errors.place ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your current city/town"
            />
            {errors.place && <p className="mt-1 text-xs text-red-500">{errors.place.message}</p>}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">Qualification *</label>
          <div className="flex flex-wrap gap-3">
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) => (
                <>
                  {QUALIFICATIONS.map(q => (
                    <label key={q} className={`cursor-pointer flex items-center px-4 py-2 border rounded-full text-sm transition-all ${
                      field.value?.includes(q) 
                      ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 text-[#2A9D8F] font-medium' 
                      : 'border-gray-200 hover:border-[#2A9D8F] text-gray-600'
                    }`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={field.value?.includes(q)}
                        onChange={(e) => {
                          const current = field.value || [];
                          const updated = e.target.checked ? [...current, q] : current.filter(item => item !== q);
                          field.onChange(updated);
                        }}
                      />
                      {q}
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.qualifications && <p className="mt-2 text-xs text-red-500">{errors.qualifications.message}</p>}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">Total Experience *</label>
          <div className="flex flex-wrap gap-3">
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <>
                  {EXPERIENCES.map(e => (
                    <label key={e} className={`cursor-pointer flex items-center px-4 py-2 border rounded-full text-sm transition-all ${
                      field.value?.includes(e) 
                      ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 text-[#2A9D8F] font-medium' 
                      : 'border-gray-200 hover:border-[#2A9D8F] text-gray-600'
                    }`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={field.value?.includes(e)}
                        onChange={(ev) => {
                          const current = field.value || [];
                          const updated = ev.target.checked ? [...current, e] : current.filter(item => item !== e);
                          field.onChange(updated);
                        }}
                      />
                      {e}
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.experience && <p className="mt-2 text-xs text-red-500">{errors.experience.message}</p>}
        </div>

        <div className="border-t border-gray-100 pt-8 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 h-12 bg-[#2A9D8F] hover:bg-[#21867a] text-white font-medium rounded-md shadow-sm transition-colors text-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit →'}
          </Button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
}
