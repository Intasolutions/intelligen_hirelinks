import { z } from 'zod';

export const partnerLogoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  category: z.enum(['DOMESTIC', 'INTERNATIONAL', 'CERTIFICATION']),
  websiteUrl: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.string().url('Must be a valid URL').optional()
  ),
  displayOrder: z.coerce.number().default(999),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),

  removeLogo: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional().default(false)),
});

export type PartnerLogoInput = z.infer<typeof partnerLogoSchema>;
