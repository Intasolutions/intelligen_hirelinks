import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  image?: { url: string; publicId: string };
  imageAlt?: string;
  
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
  };
  
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { url: String, publicId: String },
    imageAlt: { type: String },
    
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: String,
      canonicalUrl: String
    },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

PageSchema.pre('validate', function(next) {
  if (this.slug) {
    this.slug = slugify(this.slug, { lower: true, strict: true });
  } else if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Page = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
