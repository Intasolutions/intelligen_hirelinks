import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IBlog extends Document {
  title: string;
  slug: string;
  subTitle?: string;
  tags: string[];
  
  excerpt: string;
  content: string;
  
  image?: { url: string; publicId: string };
  
  publishStatus: 'DRAFT' | 'PUBLISHED';
  displayOrder: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  publishedAt: Date | null;
  
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

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subTitle: { type: String },
    tags: { type: [String], default: [] },
    
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    
    image: { url: String, publicId: String },
    
    publishStatus: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
    displayOrder: { type: Number, default: 999 },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    publishedAt: { type: Date, default: null },
    
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

BlogSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  if (this.isModified('publishStatus') && this.publishStatus === 'PUBLISHED' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Query middleware for soft delete
BlogSchema.pre('find', function() {
  this.where({ deletedAt: null });
});
BlogSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});
BlogSchema.pre('countDocuments', function() {
  this.where({ deletedAt: null });
});

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
