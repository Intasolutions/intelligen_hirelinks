import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  email: string;
  nationality?: string;
  place?: string;
  qualifications: string[];
  experience: string[];
  serviceInterested?: string;
  message?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  source: 'REGISTRATION' | 'CONTACT';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  whatsappNumber: { type: String },
  email: { type: String, required: true },
  nationality: { type: String },
  place: { type: String },
  qualifications: [{ type: String }],
  experience: [{ type: String }],
  serviceInterested: { type: String },
  message: { type: String },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'], default: 'PENDING' },
  source: { type: String, enum: ['REGISTRATION', 'CONTACT'], default: 'REGISTRATION' },
}, { timestamps: true });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
