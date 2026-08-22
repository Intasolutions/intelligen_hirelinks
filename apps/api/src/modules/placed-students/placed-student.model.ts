import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacedStudent extends Document {
  name: string;
  photo?: { url: string; publicId: string };
  program?: string;
  country?: string;
  /** ISO 3166-1 alpha-2 code, lowercase (e.g. "es" for Spain) — used to build the flag icon (fi fi-{countryCode}). */
  countryCode?: string;

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

const PlacedStudentSchema = new Schema<IPlacedStudent>(
  {
    name: { type: String, required: true },
    photo: {
      url: { type: String },
      publicId: { type: String }
    },
    program: { type: String },
    country: { type: String },
    countryCode: { type: String, lowercase: true },

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
PlacedStudentSchema.pre('find', function() {
  this.where({ deletedAt: null });
});
PlacedStudentSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});
PlacedStudentSchema.pre('countDocuments', function() {
  this.where({ deletedAt: null });
});

export const PlacedStudent = mongoose.models.PlacedStudent || mongoose.model<IPlacedStudent>('PlacedStudent', PlacedStudentSchema);
