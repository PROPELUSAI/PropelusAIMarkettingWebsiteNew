import { Router } from 'express';
import mongoose from 'mongoose';
import Testimonial from '../models/Testimonial.js';
import { normalizeDoc, buildSearchFilter, buildDualUpdate } from '../utils/normalize.js';

const router = Router();

const oid = (id) => new mongoose.Types.ObjectId(id);

// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    const andConditions = [];

    if (status) filter.status = status;
    if (search) {
      andConditions.push(buildSearchFilter(['full_name', 'email'], search));
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const testimonials = await Testimonial.collection
      .find(filter)
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();
    
    res.json(testimonials.map(t => normalizeDoc(t)));
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/testimonials/:id
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.collection.findOne({ _id: oid(req.params.id) });
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(normalizeDoc(testimonial));
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/testimonials/:id
router.put('/:id', async (req, res) => {
  try {
    const { _id, id, __v, created_at, createdAt, ...safeBody } = req.body;
    const result = await Testimonial.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ ...safeBody, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/testimonials/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await Testimonial.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ status, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update testimonial status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/testimonials/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Testimonial.collection.deleteOne({ _id: oid(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
