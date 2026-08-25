import mongoose, { Schema, Document } from 'mongoose';

export interface IPartnerLogo extends Document {
  name: string;
  logo?: { url: string; publicId: string };
  category: 'DOMESTIC' | 'INTERNATIONAL' | 'CERTIFICATION';
  websiteUrl?: string;

  // CMS Standards
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';

  // Audit
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const PartnerLogoSchema = new Schema<IPartnerLogo>(
  {
    name: { type: String, required: true },
    logo: {
      url: { type: String },
      publicId: { type: String }
    },
    category: { type: String, enum: ['DOMESTIC', 'INTERNATIONAL', 'CERTIFICATION'], required: true },
    websiteUrl: { type: String },

    displayOrder: { type: Number, default: 999 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Query middleware for soft delete
PartnerLogoSchema.pre('find', function() {
  this.where({ deletedAt: null });
});
PartnerLogoSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});
PartnerLogoSchema.pre('countDocuments', function() {
  this.where({ deletedAt: null });
});

export const PartnerLogo = mongoose.models.PartnerLogo || mongoose.model<IPartnerLogo>('PartnerLogo', PartnerLogoSchema);
