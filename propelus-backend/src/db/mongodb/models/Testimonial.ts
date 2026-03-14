import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  fullName: string;
  email: string;
  testimonial: string;
  status: string;
  mobileNumber?: string | null;
  rating?: number | null;
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
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ createdAt: -1 });

export const Testimonial = mongoose.model<ITestimonial>(
  'Testimonial',
  testimonialSchema
);
