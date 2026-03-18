import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  fullName: string;
  email: string;
  testimonial: string;
  status: string;
  mobileNumber?: string | null;
  rating?: number | null;
  designation?: string | null;
  company?: string | null;
  industry?: string | null;
  city?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    testimonial: { type: String, required: true },
    status: { type: String, default: 'pending', index: true },
    mobileNumber: { type: String, default: null },
    rating: { type: Number, default: null },
    designation: { type: String, default: null },
    company: { type: String, default: null },
    industry: { type: String, default: null },
    city: { type: String, default: null },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

testimonialSchema.index({ createdAt: -1 });

export const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
