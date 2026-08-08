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

export const settingsSchema = z.object({
  // General
  companyName: z.string().min(1, 'Company name is required').max(100),
  companyEmail: z.string().email('Invalid email address'),
  companyPhone: z.string().max(20).optional().nullable(),
  companyWhatsapp: z.string().max(20).optional().nullable(),
  addresses: z.preprocess(
    jsonParseString,
    z.array(z.object({
      address: z.string().min(1, 'Address is required').max(500),
      isPrimary: z.boolean().default(false)
    }))
  ).optional().default([]),
  businessHours: z.string().max(200).optional().nullable(),

  // Branding
  logo: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  darkLogo: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  favicon: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),

  // Contact
  googleMapEmbed: z.string().optional().nullable(),

  // Social Links
  facebook: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  instagram: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  youtube: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  threads: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),

  // SEO Defaults
  defaultMetaTitle: z.string().max(60).optional().nullable(),
  defaultMetaDescription: z.string().max(160).optional().nullable(),
  defaultKeywords: z.string().max(200).optional().nullable(),
  defaultCanonical: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  defaultOgImage: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  robotsIndex: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
  robotsFollow: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),

});

export type SettingsInput = z.infer<typeof settingsSchema>;
