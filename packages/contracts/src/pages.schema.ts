import { z } from 'zod';

export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'), // No maximum limit
  removeImage: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional().default(false)),
});

export type PageInput = z.infer<typeof pageSchema>;
