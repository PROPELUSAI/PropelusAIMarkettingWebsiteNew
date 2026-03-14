import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contacts.js';
import testimonialRoutes from './routes/testimonials.js';
import affiliateRoutes from './routes/affiliates.js';
import blogRoutes from './routes/blogs.js';
import newsletterRoutes from './routes/newsletter.js';
import chatRoutes from './routes/chats.js';

// Pre-load models so their collections & indexes are registered at startup
import './models/BlogAuditLog.js';
import './models/ChatConversation.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'propelus';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  dbName: MONGODB_DB_NAME,
})
  .then(() => {
    console.log(`✅ Connected to MongoDB (database: ${MONGODB_DB_NAME})`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/chats', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

export default app;
