import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  fullName: string;
  companyName?: string | null;
  email: string;
  country: string;
  mobileNumber?: string | null;
  interest?: string | null;
  scheduledTime: Date;
  description?: string | null;
  promoCode?: string | null;
  affiliateCode?: string | null;
  leadStatus: string;
  priority: string;
  assignedTo?: string | null;
  adminNotes?: string | null;
  responseSent: boolean;
  responseDate?: Date | null;
  responseMethod?: string | null;
  followUpDate?: Date | null;
  convertedAt?: Date | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    fullName: { type: String, required: true },
    companyName: { type: String, default: null },
    email: { type: String, required: true },
    country: { type: String, required: true },
    mobileNumber: { type: String, default: null },
    interest: { type: String, default: null },
    scheduledTime: { type: Date, required: true },
    description: { type: String, default: null },
    promoCode: { type: String, default: null },
    affiliateCode: { type: String, default: null },
    leadStatus: { type: String, default: 'open', index: true },
    priority: { type: String, default: 'medium', index: true },
    assignedTo: { type: String, default: null, index: true },
    adminNotes: { type: String, default: null },
    responseSent: { type: Boolean, default: false },
    responseDate: { type: Date, default: null },
    responseMethod: { type: String, default: null },
    followUpDate: { type: Date, default: null, index: true },
    convertedAt: { type: Date, default: null },
    updatedBy: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ createdAt: -1 });

export const ContactSubmission = mongoose.model<IContactSubmission>(
  'ContactSubmission',
  contactSubmissionSchema
);
