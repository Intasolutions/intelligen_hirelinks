import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IServiceStep {
  title: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

export interface IServiceBenefitItem {
  heading: string;
  description?: string;
  displayOrder: number;
}

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  
  processDescription?: string;
  steps: IServiceStep[];
  
  benefits: {
    heading?: string;
    description?: string;
  };
  benefitItems: IServiceBenefitItem[];
  
  primaryImage?: { url: string; publicId: string };
  primaryImageAlt?: string;
  secondaryImage?: { url: string; publicId: string };
  secondaryImageAlt?: string;
  
  reviewSectionDescription?: string;
  
  publishStatus: 'DRAFT' | 'PUBLISHED';
  displayOrder: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
  };
  
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const StepSchema = new Schema<IServiceStep>({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  displayOrder: { type: Number, default: 999 }
}, { _id: false });

const BenefitItemSchema = new Schema<IServiceBenefitItem>({
  heading: { type: String, required: true },
  description: { type: String },
  displayOrder: { type: Number, default: 999 }
}, { _id: false });

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    
    processDescription: { type: String },
    steps: { type: [StepSchema], default: [] },
    
    benefits: {
      heading: { type: String, default: 'Technical & Operational Benefits' },
      description: { type: String }
    },
    benefitItems: { type: [BenefitItemSchema], default: [] },
    
    primaryImage: { url: String, publicId: String },
    primaryImageAlt: { type: String },
    secondaryImage: { url: String, publicId: String },
    secondaryImageAlt: { type: String },
    
    reviewSectionDescription: { type: String },
    
    publishStatus: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
    displayOrder: { type: Number, default: 999 },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: String,
      canonicalUrl: String
    },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ServiceSchema.pre('validate', function(next) {
  if (this.slug) {
    this.slug = slugify(this.slug, { lower: true, strict: true });
  } else if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Query middleware for soft delete
ServiceSchema.pre('find', function() {
  this.where({ deletedAt: null });
});
ServiceSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});
ServiceSchema.pre('countDocuments', function() {
  this.where({ deletedAt: null });
});

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
