import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAdminNote {
  _id: Types.ObjectId;
  text: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAffiliateRegistration extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  description: string;
  status: string;
  submittedAt: Date;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  adminNotes: IAdminNote[];
  commissionRate?: number | null;
  affiliateCode?: string | null;
  hasNetwork?: string | null;
  networkType?: string | null;
  industry?: string | null;
  interestedServices?: string[] | null;
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
    adminNotes: [{
      text: { type: String, required: true },
      createdBy: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }],
    commissionRate: { type: Number, default: null },
    affiliateCode: { type: String, default: null, unique: true, sparse: true },
    hasNetwork: { type: String, default: null },
    networkType: { type: String, default: null },
    industry: { type: String, default: null },
    interestedServices: [{ type: String }],
  },
  { timestamps: true }
);

affiliateRegistrationSchema.index({ createdAt: -1 });

export const AffiliateRegistration =
  mongoose.models.AffiliateRegistration ||
  mongoose.model<IAffiliateRegistration>('AffiliateRegistration', affiliateRegistrationSchema);
