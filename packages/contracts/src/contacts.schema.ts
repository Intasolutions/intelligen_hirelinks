import { z } from 'zod';

// Shared by two very different public forms — the full Registration form
// (nationality/qualifications/experience) and the lightweight "Get In Touch"
// contact form (serviceInterested/message) — so each group of fields is
// optional and only required by the form that actually collects it. Which
// group applies is distinguished by `source` (REGISTRATION vs CONTACT) once
// saved, both landing in the same Admin > Enquiries list.
export const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be valid'),
  whatsappNumber: z.string().optional(),
  email: z.string().email('Invalid email format'),
  nationality: z.string().optional(),
  place: z.string().optional(),

  qualifications: z.array(z.string()).optional().default([]),
  experience: z.array(z.string()).optional().default([]),

  // "Get In Touch" contact-form fields
  serviceInterested: z.string().optional(),
  message: z.string().optional(),

  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']).default('PENDING'),
  source: z.enum(['REGISTRATION', 'CONTACT']).default('REGISTRATION')
});

export type ContactInput = z.infer<typeof contactSchema>;
