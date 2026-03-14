import { Router } from 'express';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import BlogAnalytics from '../models/BlogAnalytics.js';
import BlogAuditLog from '../models/BlogAuditLog.js';
import { normalizeDoc, buildDualUpdate } from '../utils/normalize.js';

const router = Router();

const oid = (id) => new mongoose.Types.ObjectId(id);

/** Log a change to blog_audit_log (non-blocking — never throws) */
async function auditLog(blogId, action, changedBy, changes) {
  try {
    await BlogAuditLog.collection.insertOne({
      blog_id: blogId,
      action,
      changed_by: changedBy ?? null,
      changes: changes ?? null,
      created_at: new Date(),
    });
  } catch (_) {
    // Audit failures must never break the main operation
  }
}

// GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const { status, category, search, featured, sortBy, sortOrder } = req.query;
    const filter = {};
    const andConditions = [];

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured !== undefined) {
      andConditions.push({ $or: [{ is_featured: featured === 'true' }, { isFeatured: featured === 'true' }] });
    }
    if (search) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ]
      });
    }
    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const sort = {};
    sort.is_featured = -1;
    sort.isFeatured = -1;
    const field = sortBy || 'created_at';
    sort[field] = sortOrder === 'asc' ? 1 : -1;

    const blogs = await Blog.collection.find(filter).sort(sort).toArray();
    res.json(blogs.map(b => normalizeDoc(b)));
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blogs/:id
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.collection.findOne({ _id: oid(req.params.id) });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(normalizeDoc(blog));
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blogs
router.post('/', async (req, res) => {
  try {
    const doc = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await Blog.collection.insertOne(doc);
    const inserted = await Blog.collection.findOne({ _id: result.insertedId });
    await auditLog(result.insertedId, 'INSERT', req.body.author_id, { new: doc });
    res.status(201).json(normalizeDoc(inserted));
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/blogs/:id
router.put('/:id', async (req, res) => {
  try {
    const old = await Blog.collection.findOne({ _id: oid(req.params.id) });
    const { _id, id, __v, created_at, createdAt, ...safeBody } = req.body;
    const result = await Blog.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ ...safeBody, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    await auditLog(oid(req.params.id), 'UPDATE', req.body.author_id, { old, new: result });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/blogs/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const updateData = { status, updated_at: new Date() };

    if (status === 'published' && !rejectionReason) {
      updateData.publish_date = new Date();
    }
    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const old = await Blog.collection.findOne({ _id: oid(req.params.id) });
    const result = await Blog.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate(updateData) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    await auditLog(oid(req.params.id), 'UPDATE', null, { old: { status: old?.status }, new: { status } });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update blog status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/blogs/:id/toggle-featured
router.patch('/:id/toggle-featured', async (req, res) => {
  try {
    const doc = await Blog.collection.findOne({ _id: oid(req.params.id) });
    if (!doc) return res.status(404).json({ error: 'Blog not found' });

    const currentFeatured = doc.is_featured ?? doc.isFeatured ?? false;
    const result = await Blog.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: { is_featured: !currentFeatured, isFeatured: !currentFeatured, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Toggle blog featured error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blogs/:id/increment-views
router.post('/:id/increment-views', async (req, res) => {
  try {
    // Try incrementing both possible field names
    const result = await Blog.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $inc: { view_count: 1, viewCount: 1 } },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blogs/:id/cta-click
router.post('/:id/cta-click', async (req, res) => {
  try {
    const { ctaType } = req.body;
    await BlogAnalytics.collection.insertOne({
      blog_id: req.params.id,
      event_type: 'cta_click',
      event_data: { cta_type: ctaType },
      created_at: new Date(),
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Track CTA click error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blogs/:id/analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const docs = await BlogAnalytics.collection
      .find({ $or: [{ blog_id: req.params.id }, { blogId: req.params.id }] })
      .sort({ created_at: -1 })
      .toArray();
    res.json(docs.map(d => normalizeDoc(d)));
  } catch (error) {
    console.error('Get blog analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/blogs/:id
router.delete('/:id', async (req, res) => {
  try {
    const old = await Blog.collection.findOne({ _id: oid(req.params.id) });
    const result = await Blog.collection.deleteOne({ _id: oid(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Blog not found' });
    await auditLog(oid(req.params.id), 'DELETE', null, { old });
    // Also delete related analytics
    await BlogAnalytics.collection.deleteMany({
      $or: [{ blog_id: req.params.id }, { blogId: req.params.id }]
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blogs/generate-slug
router.post('/generate-slug', async (req, res) => {
  try {
    const { title } = req.body;
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await Blog.collection.findOne({ slug: baseSlug });
    if (!existing) {
      return res.json({ slug: baseSlug });
    }

    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;
    while (await Blog.collection.findOne({ slug: newSlug })) {
      counter++;
      newSlug = `${baseSlug}-${counter}`;
    }
    res.json({ slug: newSlug });
  } catch (error) {
    console.error('Generate slug error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
