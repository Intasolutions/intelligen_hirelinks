import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be valid'),
  whatsappNumber: z.string().optional(),
  email: z.string().email('Invalid email format'),
  nationality: z.string().min(2, 'Nationality is required'),
  place: z.string().min(2, 'Place is required'),
  
  qualifications: z.array(z.string()).min(1, 'Select at least one qualification'),
  experience: z.array(z.string()).min(1, 'Select at least one experience level'),
  
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']).default('PENDING'),
  source: z.enum(['REGISTRATION', 'CONTACT']).default('REGISTRATION')
});

export type ContactInput = z.infer<typeof contactSchema>;
