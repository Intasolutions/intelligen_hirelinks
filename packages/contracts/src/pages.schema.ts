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

export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required'), // No maximum limit
  removeImage: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional().default(false)),
  imageAlt: z.string().optional().nullable(),
  seo: z.preprocess(
    jsonParseString,
    z.object({
      metaTitle: z.string().optional().nullable(),
      metaDescription: z.string().optional().nullable(),
      keywords: z.string().optional().nullable(),
      canonicalUrl: z.string().optional().nullable(),
    }).optional().default({})
  ),
});

export type PageInput = z.infer<typeof pageSchema>;
