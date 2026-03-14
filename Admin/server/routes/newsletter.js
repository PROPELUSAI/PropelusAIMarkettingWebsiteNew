import { Router } from 'express';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import NewsletterCampaign from '../models/NewsletterCampaign.js';

const router = Router();
const oid = (id) => new mongoose.Types.ObjectId(id);

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads', 'newsletter');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer config — max 5MB per file, max 10 files
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'text/plain',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  },
});

const getResend = () => {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
    throw new Error('RESEND_API_KEY is not configured. Please add your Resend API key to .env');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// ─── SUBSCRIBERS ─────────────────────────────────────────────────────────────

// GET /api/newsletter/subscribers
router.get('/subscribers', async (req, res) => {
  try {
    const { status, search, source } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const subscribers = await NewsletterSubscriber.collection
      .find(filter)
      .sort({ subscribedAt: -1, createdAt: -1 })
      .toArray();

    res.json(subscribers.map(s => ({ ...s, id: s._id })));
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/newsletter/subscribers/stats
router.get('/subscribers/stats', async (req, res) => {
  try {
    const total = await NewsletterSubscriber.collection.countDocuments({});
    const active = await NewsletterSubscriber.collection.countDocuments({ status: 'active' });
    const unsubscribed = await NewsletterSubscriber.collection.countDocuments({ status: 'unsubscribed' });

    // New this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await NewsletterSubscriber.collection.countDocuments({
      $or: [
        { subscribedAt: { $gte: startOfMonth } },
        { createdAt: { $gte: startOfMonth } },
      ],
    });

    res.json({ total, active, unsubscribed, newThisMonth });
  } catch (error) {
    console.error('Get subscriber stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/newsletter/subscribers/:id
router.delete('/subscribers/:id', async (req, res) => {
  try {
    const result = await NewsletterSubscriber.collection.deleteOne({ _id: oid(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/newsletter/subscribers/:id/unsubscribe
router.patch('/subscribers/:id/unsubscribe', async (req, res) => {
  try {
    const result = await NewsletterSubscriber.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: { status: 'unsubscribed', unsubscribedAt: new Date(), updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ ...result, id: result._id });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────

// GET /api/newsletter/campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await NewsletterCampaign.find({})
      .sort({ sent_at: -1, createdAt: -1 })
      .lean();
    res.json(campaigns.map(c => ({ ...c, id: c._id })));
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/newsletter/upload — upload attachments (max 10 files, 5MB each)
router.post('/upload', (req, res) => {
  const uploadMiddleware = upload.array('files', 10);
  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB per file.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const attachments = req.files.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
      path: f.path,
    }));

    res.json({ success: true, attachments });
  });
});

// GET /api/newsletter/uploads/:filename — serve uploaded file
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.sendFile(filePath);
});

// POST /api/newsletter/campaigns/send — create + send campaign
router.post('/campaigns/send', async (req, res) => {
  const { subject, body_html, body_text, compose_mode, sent_by, attachments } = req.body;

  if (!subject) {
    return res.status(400).json({ error: 'Subject is required' });
  }

  // Validate based on compose mode
  if (compose_mode === 'html' && !body_html) {
    return res.status(400).json({ error: 'HTML body is required for HTML mode' });
  }
  if (compose_mode === 'normal' && !body_text) {
    return res.status(400).json({ error: 'Message body is required' });
  }

  // Fetch all active subscribers
  const subscribers = await NewsletterSubscriber.collection
    .find({ status: 'active' })
    .toArray();

  if (subscribers.length === 0) {
    return res.status(400).json({ error: 'No active subscribers to send to' });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'newsletter@yourdomain.com';
  const fromName = process.env.RESEND_FROM_NAME || 'PropelusAI';

  // For normal mode, convert plain text to simple HTML
  let finalHtml = body_html || null;
  let finalText = body_text || null;

  if (compose_mode === 'normal' && body_text) {
    // Convert plain text to styled HTML
    const escapedText = body_text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
    finalHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; line-height: 1.6;">
  <p>Hi {{name}},</p>
  <div>${escapedText}</div>
  <br/>
  <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">— ${fromName}</p>
</div>`;
  }

  // Prepare Resend attachments from uploaded files
  const resendAttachments = [];
  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    for (const att of attachments) {
      const filePath = att.path || path.join(UPLOADS_DIR, att.filename);
      if (fs.existsSync(filePath)) {
        resendAttachments.push({
          filename: att.originalName,
          content: fs.readFileSync(filePath).toString('base64'),
          content_type: att.mimeType,
        });
      }
    }
  }

  // Create campaign record
  const campaignDoc = {
    subject,
    body_html: finalHtml,
    body_text: finalText,
    compose_mode: compose_mode || 'html',
    from_email: fromEmail,
    from_name: fromName,
    attachments: attachments || [],
    status: 'sending',
    total_subscribers: subscribers.length,
    sent_count: 0,
    failed_count: 0,
    failed_emails: [],
    sent_by: sent_by || null,
    sent_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const insertResult = await NewsletterCampaign.collection.insertOne(campaignDoc);
  const campaignId = insertResult.insertedId;

  // Respond immediately, send in background
  res.json({
    success: true,
    campaignId,
    totalSubscribers: subscribers.length,
    message: `Sending to ${subscribers.length} subscribers...`,
  });

  // Background send
  try {
    const resend = getResend();
    let sentCount = 0;
    const failedEmails = [];

    for (const sub of subscribers) {
      try {
        const emailPayload = {
          from: `${fromName} <${fromEmail}>`,
          to: [sub.email],
          subject,
          html: (finalHtml || '')
            .replace(/\{\{name\}\}/g, sub.name || 'Subscriber')
            .replace(/\{\{email\}\}/g, sub.email),
        };

        if (finalText) {
          emailPayload.text = finalText.replace(/\{\{name\}\}/g, sub.name || 'Subscriber');
        }

        if (resendAttachments.length > 0) {
          emailPayload.attachments = resendAttachments;
        }

        await resend.emails.send(emailPayload);
        sentCount++;
      } catch (emailErr) {
        console.error(`Failed to send to ${sub.email}:`, emailErr.message);
        failedEmails.push(sub.email);
      }
    }

    await NewsletterCampaign.collection.updateOne(
      { _id: campaignId },
      {
        $set: {
          status: 'sent',
          sent_count: sentCount,
          failed_count: failedEmails.length,
          failed_emails: failedEmails,
          sent_at: new Date(),
          updated_at: new Date(),
        },
      }
    );

    console.log(`✅ Campaign ${campaignId}: sent ${sentCount}/${subscribers.length}, failed ${failedEmails.length}`);
  } catch (error) {
    console.error('Campaign send error:', error.message);
    await NewsletterCampaign.collection.updateOne(
      { _id: campaignId },
      { $set: { status: 'failed', updated_at: new Date() } }
    );
  }
});

// GET /api/newsletter/campaigns/:id
router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await NewsletterCampaign.collection.findOne({ _id: oid(req.params.id) });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ ...campaign, id: campaign._id });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
