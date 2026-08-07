import { z } from 'zod';

const jsonParseString = (val: unknown) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  shortDescription: z.string().min(1, 'Short description is required').max(300),
  
  processDescription: z.string().optional().nullable(),
  steps: z.preprocess(
    jsonParseString,
    z.array(
      z.object({
        title: z.string().min(1, 'Step title is required'),
        description: z.string().optional(),
        icon: z.string().optional(),
        displayOrder: z.coerce.number().default(999),
      })
    ).optional().default([])
  ),
  
  benefits: z.preprocess(
    jsonParseString,
    z.object({
      heading: z.string().optional(),
      description: z.string().optional(),
    }).optional().default({})
  ),
  
  benefitItems: z.preprocess(
    jsonParseString,
    z.array(
      z.object({
        heading: z.string().min(1, 'Benefit heading is required'),
        description: z.string().optional(),
        displayOrder: z.coerce.number().default(999),
      })
    ).optional().default([])
  ),
  
  reviewSectionDescription: z.string().optional().nullable(),
  
  publishStatus: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  displayOrder: z.coerce.number().default(999),
  isFeatured: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  
  seo: z.preprocess(
    jsonParseString,
    z.object({
      metaTitle: z.string().optional().nullable(),
      metaDescription: z.string().optional().nullable(),
      keywords: z.string().optional().nullable(),
      canonicalUrl: z.string().optional().nullable(),
    }).optional().default({})
  )
});

export type ServiceInput = z.infer<typeof serviceSchema>;
