import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateRegistration extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  description: string;
  status: string;
  submittedAt: Date;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  adminNotes?: string | null;
  commissionRate?: number | null;
  affiliateCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const affiliateRegistrationSchema = new Schema<IAffiliateRegistration>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    mobileNumber: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'pending', index: true },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: String, default: null },
    adminNotes: { type: String, default: null },
    commissionRate: { type: Number, default: null },
    affiliateCode: { type: String, default: null, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

affiliateRegistrationSchema.index({ createdAt: -1 });

export const AffiliateRegistration = mongoose.model<IAffiliateRegistration>(
  'AffiliateRegistration',
  affiliateRegistrationSchema
);
