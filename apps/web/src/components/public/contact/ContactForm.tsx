'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactInput } from '@hirelinks/contracts';
import { ContactsService } from '../../../services/contacts.service';
import { ServicesService } from '../../../services/services.service';
import { toast, Toaster } from 'sonner';
import { Check } from 'lucide-react';

const LOREM = 'Fill Out The Form Below And Our Team Will Get Back To You Shortly.';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      qualifications: [],
      experience: [],
      source: 'CONTACT',
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await ServicesService.getPublicServices();
        setServices(res.data || []);
      } catch {
        // Dropdown just shows no options if this fails — not worth blocking the form.
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const res = await ContactsService.createPublic({ ...data, source: 'CONTACT' });
      if (res.success) {
        setIsSuccess(true);
        reset();
      } else {
        toast.error('Failed to send your message');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="w-full bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[1360px] rounded-2xl border border-[#e5e5e5] p-10 text-center sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2a9d8f]/10">
            <Check className="h-8 w-8 text-[#2a9d8f]" />
          </div>
          <h2 className="mt-6 font-display-rounded text-2xl font-bold text-black">Message Sent!</h2>
          <p className="mt-3 text-black/70">
            Thank you for reaching out. Our team has received your message and will get back to you shortly.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-8 inline-flex h-11 items-center rounded-full border border-[#2a9d8f] px-6 text-sm font-medium text-[#2a9d8f] transition-colors hover:bg-[#2a9d8f]/10"
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-10 lg:pb-24">
      <div className="mx-auto max-w-[1360px] rounded-2xl border border-[#e5e5e5] p-6 sm:p-10">
        <h2
          className="font-display-rounded font-bold uppercase leading-[0.9] text-[#9a9a9a]"
          style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.02em' }}
        >
          Get In Touch With Us
        </h2>
        <p className="mt-3 font-sans text-sm text-black/70 sm:text-base">{LOREM}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-black">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                placeholder="Enter"
                className={`h-12 w-full rounded-md border bg-[#f5f5f5] px-4 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-[#2a9d8f] focus:bg-white ${
                  errors.fullName ? 'border-red-500' : 'border-transparent'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">Phone Number</label>
              <input
                type="tel"
                {...register('phoneNumber')}
                placeholder="Enter"
                className={`h-12 w-full rounded-md border bg-[#f5f5f5] px-4 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-[#2a9d8f] focus:bg-white ${
                  errors.phoneNumber ? 'border-red-500' : 'border-transparent'
                }`}
              />
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="Enter"
                className={`h-12 w-full rounded-md border bg-[#f5f5f5] px-4 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-[#2a9d8f] focus:bg-white ${
                  errors.email ? 'border-red-500' : 'border-transparent'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">Service Interested In</label>
              <select
                {...register('serviceInterested')}
                defaultValue=""
                className="h-12 w-full rounded-md border border-transparent bg-[#f5f5f5] px-4 text-sm text-black outline-none transition-colors focus:border-[#2a9d8f] focus:bg-white"
              >
                <option value="" disabled>Select</option>
                {services.map((s) => (
                  <option key={s._id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">Message</label>
            <textarea
              {...register('message')}
              rows={6}
              placeholder="Enter"
              className="w-full resize-none rounded-md border border-transparent bg-[#f5f5f5] p-4 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-[#2a9d8f] focus:bg-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center gap-3 rounded-full bg-black pl-6 pr-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a2a]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H4M11 3V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </section>
  );
}
