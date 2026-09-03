import { z } from 'zod';

export const reviewSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(100),
  rating: z.coerce.number().min(1).max(5),
  linkedType: z.enum(['SERVICE', 'PROGRAM']),
  linkedItem: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'), // MongoDB ObjectId string
  reviewComment: z.string().min(1, 'Review comment is required'),
  moderationStatus: z.enum(['APPROVED', 'REJECTED']),
  featureOnHomepage: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  displayOrder: z.coerce.number().default(999),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  
  // Optional string fields
  reviewDate: z.string().optional().nullable(), // ISO string or simple date string
  country: z.string().optional().nullable(),
  // ISO 3166-1 alpha-2 code, lowercase (e.g. "es" for Spain) — used to resolve the flag icon path.
  // Empty string (an unfilled optional form field) is treated as "not provided" rather than a validation failure.
  countryCode: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z
      .string()
      .regex(/^[a-zA-Z]{2}$/, 'Country code must be exactly 2 letters (ISO 3166-1 alpha-2, e.g. "in" for India) — not a phone dialing code')
      .toLowerCase()
      .optional()
  ),

  removeImage: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional().default(false)),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
