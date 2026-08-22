import { z } from 'zod';

export const placedStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  program: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  // ISO 3166-1 alpha-2 code, lowercase (e.g. "es" for Spain) — used to resolve
  // the flag icon via the flag-icons package (fi fi-{countryCode} class).
  // Empty string (an unfilled optional form field) is treated as "not
  // provided" rather than a validation failure.
  countryCode: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z
      .string()
      .regex(/^[a-zA-Z]{2}$/, 'Country code must be exactly 2 letters (ISO 3166-1 alpha-2, e.g. "in" for India) — not a phone dialing code')
      .toLowerCase()
      .optional()
  ),
  displayOrder: z.coerce.number().default(999),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),

  removeImage: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional().default(false)),
});

export type PlacedStudentInput = z.infer<typeof placedStudentSchema>;
