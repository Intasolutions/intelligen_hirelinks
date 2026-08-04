import { z } from 'zod';

export const reviewSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(100),
  rating: z.coerce.number().min(1).max(5),
  linkedType: z.enum(['SERVICE', 'PROGRAM']),
  linkedItem: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'), // MongoDB ObjectId string
  reviewComment: z.string().min(1, 'Review comment is required'),
  moderationStatus: z.enum(['APPROVED', 'REJECTED']),
  featureOnHomepage: z.coerce.boolean(),
  displayOrder: z.coerce.number().default(999),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  
  // Optional string fields
  reviewDate: z.string().optional().nullable(), // ISO string or simple date string
  
  // customerPhoto is handled separately via multipart upload
});

export type ReviewInput = z.infer<typeof reviewSchema>;
