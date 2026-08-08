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

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  slug: z.string().optional(),
  subTitle: z.string().optional().nullable(),
  
  tags: z.preprocess(
    jsonParseString,
    z.array(z.string()).optional().default([])
  ),
  
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required'),
  
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
  ),

  removeImage: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional().default(false)),
  coverImageAlt: z.string().optional().nullable(),
});

export type BlogInput = z.infer<typeof blogSchema>;
