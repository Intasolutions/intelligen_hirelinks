import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyWhatsapp?: string;
  addresses?: { address: string; isPrimary: boolean }[];
  city?: string;
  /** ISO 3166-1 alpha-2 code, lowercase — resolves to /images/flags/{countryCode}.svg. */
  countryCode?: string;
  businessHours?: string;

  logo?: string;
  darkLogo?: string;
  favicon?: string;

  googleMapEmbed?: string;

  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  threads?: string;

  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultKeywords?: string;
  defaultCanonical?: string;
  defaultOgImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;

  updatedBy?: mongoose.Types.ObjectId;
}

const SettingsSchema = new Schema<ISettings>(
  {
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyPhone: { type: String },
    companyWhatsapp: { type: String },
    addresses: [{
      address: { type: String, required: true },
      isPrimary: { type: Boolean, default: false }
    }],
    city: { type: String },
    countryCode: { type: String, lowercase: true },
    businessHours: { type: String },

    logo: { type: String },
    darkLogo: { type: String },
    favicon: { type: String },

    googleMapEmbed: { type: String },

    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    threads: { type: String },

    defaultMetaTitle: { type: String },
    defaultMetaDescription: { type: String },
    defaultKeywords: { type: String },
    defaultCanonical: { type: String },
    defaultOgImage: { type: String },
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },

    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
