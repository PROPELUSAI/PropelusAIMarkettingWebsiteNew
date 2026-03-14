import mongoose from 'mongoose';

const blogAuditLogSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['INSERT', 'UPDATE', 'DELETE'],
  },
  changed_by: {
    type: String,
    default: null,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
blogAuditLogSchema.index({ blog_id: 1 });
blogAuditLogSchema.index({ action: 1 });
blogAuditLogSchema.index({ created_at: -1 });

export default mongoose.model('BlogAuditLog', blogAuditLogSchema);
