import mongoose from 'mongoose';

const EMAIL_REGEX = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

const testimonialSchema = new mongoose.Schema({
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
  testimonial: {
    type: String,
    required: [true, 'Testimonial message is required'],
    minlength: [10, 'Testimonial must be at least 10 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'denied'],
      message: 'Status must be pending, approved, or denied',
    },
    default: 'pending',
  },
  mobile_number: { type: String, default: null, trim: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
testimonialSchema.index({ status: 1 });
testimonialSchema.index({ created_at: -1 });
testimonialSchema.index({ email: 1 });
// Sparse index — only indexes docs where mobile_number exists
testimonialSchema.index({ mobile_number: 1 }, { sparse: true });

export default mongoose.model('Testimonial', testimonialSchema);
