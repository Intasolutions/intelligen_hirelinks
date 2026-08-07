import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IProgramStep {
  title: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

export interface IProgramBenefitItem {
  heading: string;
  description?: string;
  displayOrder: number;
}

export interface IProgram extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  
  processDescription?: string;
  steps: IProgramStep[];
  
  benefits: {
    heading?: string;
    description?: string;
  };
  benefitItems: IProgramBenefitItem[];
  
  primaryImage?: { url: string; publicId: string };
  secondaryImage?: { url: string; publicId: string };
  
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

const StepSchema = new Schema<IProgramStep>({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  displayOrder: { type: Number, default: 999 }
}, { _id: false });

const BenefitItemSchema = new Schema<IProgramBenefitItem>({
  heading: { type: String, required: true },
  description: { type: String },
  displayOrder: { type: Number, default: 999 }
}, { _id: false });

const ProgramSchema = new Schema<IProgram>(
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
    secondaryImage: { url: String, publicId: String },
    
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

ProgramSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Query middleware for soft delete
ProgramSchema.pre('find', function() {
  this.where({ deletedAt: null });
});
ProgramSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});
ProgramSchema.pre('countDocuments', function() {
  this.where({ deletedAt: null });
});

export const Program = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);
