import mongoose from 'mongoose';

const EMAIL_REGEX = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

const affiliateRegistrationSchema = new mongoose.Schema({
  submitted_at: { type: Date, default: Date.now },

  // Basic information (user-submitted)
  full_name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => EMAIL_REGEX.test(v),
      message: (props) => `Invalid email format: ${props.value}`,
    },
  },
  mobile_number: { type: String, default: null, trim: true },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
  },

  // Admin management fields
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'denied'],
      message: 'Status must be pending, approved, or denied',
    },
    default: 'pending',
  },
  affiliate_status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'active', 'inactive', 'suspended'],
      message: 'Invalid affiliate_status value',
    },
    default: 'pending',
  },
  lead_status: {
    type: String,
    enum: {
      values: ['open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam'],
      message: 'Invalid lead_status value',
    },
    default: 'open',
  },
  priority: {
    type: String,
    enum: {
      values: ['high', 'medium', 'low'],
      message: 'Priority must be high, medium, or low',
    },
    default: 'medium',
  },
  assigned_to: { type: String, default: null },
  admin_notes: { type: String, default: null },
  reviewed_at: { type: Date, default: null },
  reviewed_by: { type: String, default: null },
  last_contacted_at: { type: Date, default: null },

  // Affiliate specific fields
  affiliate_code: { type: String, unique: true, sparse: true, default: null },
  commission_rate: { type: Number, default: null },
  approved_at: { type: Date, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
affiliateRegistrationSchema.index({ status: 1 });
affiliateRegistrationSchema.index({ affiliate_status: 1 });
affiliateRegistrationSchema.index({ lead_status: 1 });
affiliateRegistrationSchema.index({ created_at: -1 });
affiliateRegistrationSchema.index({ submitted_at: -1 });
affiliateRegistrationSchema.index({ email: 1 });
affiliateRegistrationSchema.index({ priority: 1 });
affiliateRegistrationSchema.index({ assigned_to: 1 });
affiliateRegistrationSchema.index({ updated_at: -1 });
affiliateRegistrationSchema.index({ last_contacted_at: 1 });
// Sparse index — only indexes docs where mobile_number exists
affiliateRegistrationSchema.index({ mobile_number: 1 }, { sparse: true });

export default mongoose.model('AffiliateRegistration', affiliateRegistrationSchema);
