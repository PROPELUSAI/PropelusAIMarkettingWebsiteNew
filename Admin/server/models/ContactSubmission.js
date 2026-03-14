import mongoose from 'mongoose';

const EMAIL_REGEX = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

const contactSubmissionSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  company_name: { type: String, default: null, trim: true },
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
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  scheduled_time: {
    type: Date,
    required: [true, 'Scheduled time is required'],
  },
  description: { type: String, default: null },
  mobile_number: { type: String, default: null, trim: true },

  // Admin management fields
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
  response_sent: { type: Boolean, default: false },
  response_date: { type: Date, default: null },
  response_method: {
    type: String,
    enum: ['email', 'phone', 'meeting', 'chat', 'other', null],
    default: null,
  },
  follow_up_date: { type: Date, default: null },
  converted_at: { type: Date, default: null },
  updated_by: { type: String, default: null },

  // Affiliate attribution
  affiliate_code: { type: String, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ created_at: -1 });
contactSubmissionSchema.index({ country: 1 });
contactSubmissionSchema.index({ lead_status: 1 });
contactSubmissionSchema.index({ priority: 1 });
contactSubmissionSchema.index({ assigned_to: 1 });
contactSubmissionSchema.index({ follow_up_date: 1 });
contactSubmissionSchema.index({ response_sent: 1 });
contactSubmissionSchema.index({ updated_at: -1 });
contactSubmissionSchema.index({ affiliate_code: 1 });
// Sparse index — only indexes docs where mobile_number exists (mirrors Supabase partial index)
contactSubmissionSchema.index({ mobile_number: 1 }, { sparse: true });

export default mongoose.model('ContactSubmission', contactSubmissionSchema);
