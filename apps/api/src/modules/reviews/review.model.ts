import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  customerPhoto?: { url: string; publicId: string };
  rating: number;
  reviewDate?: Date;
  reviewComment: string;
  country?: string;
  /** ISO 3166-1 alpha-2 code, lowercase (e.g. "es" for Spain) — used to build the flag icon path. */
  countryCode?: string;
  
  linkedType: 'SERVICE' | 'PROGRAM';
  linkedItem: mongoose.Types.ObjectId;
  
  moderationStatus: 'APPROVED' | 'REJECTED';
  featureOnHomepage: boolean;
  
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

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true },
    customerPhoto: {
      url: { type: String },
      publicId: { type: String }
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewDate: { type: Date },
    reviewComment: { type: String, required: true },
    country: { type: String },
    countryCode: { type: String, lowercase: true },

    linkedType: { type: String, enum: ['SERVICE', 'PROGRAM'], required: true },
    linkedItem: { type: Schema.Types.ObjectId, required: true, refPath: 'linkedType' },
    
    moderationStatus: { type: String, enum: ['APPROVED', 'REJECTED'], required: true },
    featureOnHomepage: { type: Boolean, required: true, default: false },
    
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
ReviewSchema.pre('find', function() {
  this.where({ deletedAt: null });
});
ReviewSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});
ReviewSchema.pre('countDocuments', function() {
  this.where({ deletedAt: null });
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
