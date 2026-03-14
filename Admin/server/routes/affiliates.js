import { Router } from 'express';
import mongoose from 'mongoose';
import AffiliateRegistration from '../models/AffiliateRegistration.js';
import { normalizeDoc, buildSearchFilter, buildDualUpdate } from '../utils/normalize.js';

const router = Router();

const oid = (id) => new mongoose.Types.ObjectId(id);

// Helper: generate unique affiliate code
async function generateAffiliateCode(fullName, email) {
  const namePart = fullName.split(' ')[0].substring(0, 4).toUpperCase();
  const emailPart = email.split('@')[0].substring(0, 3).toUpperCase();

  let code;
  let attempts = 0;
  do {
    const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    code = `AFF${namePart}${emailPart}${random}`;
    const existing = await AffiliateRegistration.collection.findOne({ $or: [{ affiliate_code: code }, { affiliateCode: code }] });
    if (!existing) break;
    attempts++;
  } while (attempts < 100);

  if (attempts >= 100) {
    code += String(Math.floor(Date.now() / 1000));
  }
  return code;
}

// GET /api/affiliates
router.get('/', async (req, res) => {
  try {
    const { status, leadStatus, priority, search } = req.query;
    const filter = {};
    const andConditions = [];

    if (status) filter.status = status;
    if (leadStatus) {
      andConditions.push({ $or: [{ lead_status: leadStatus }, { leadStatus: leadStatus }] });
    }
    if (priority) filter.priority = priority;
    if (search) {
      andConditions.push(buildSearchFilter(['full_name', 'email', 'mobile_number'], search));
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const affiliates = await AffiliateRegistration.collection
      .find(filter)
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();
    
    res.json(affiliates.map(a => normalizeDoc(a)));
  } catch (error) {
    console.error('Get affiliates error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/affiliates/:id
router.get('/:id', async (req, res) => {
  try {
    const affiliate = await AffiliateRegistration.collection.findOne({ _id: oid(req.params.id) });
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(affiliate));
  } catch (error) {
    console.error('Get affiliate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/affiliates/:id
router.put('/:id', async (req, res) => {
  try {
    const { _id, id, __v, created_at, createdAt, ...safeBody } = req.body;
    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ ...safeBody, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update affiliate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/affiliates/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status, updated_at: new Date() };
    if (status === 'approved') {
      updates.reviewed_at = new Date();
    }
    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate(updates) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update affiliate status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/affiliates/:id/lead-status
router.patch('/:id/lead-status', async (req, res) => {
  try {
    const { lead_status } = req.body;
    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ lead_status, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update affiliate lead status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/affiliates/:id/priority
router.patch('/:id/priority', async (req, res) => {
  try {
    const { priority } = req.body;
    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ priority, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update affiliate priority error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/affiliates/:id/note
router.post('/:id/note', async (req, res) => {
  try {
    const { note } = req.body;
    const affiliate = await AffiliateRegistration.collection.findOne({ _id: oid(req.params.id) });
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    const norm = normalizeDoc(affiliate);
    const existingNotes = norm.admin_notes || '';
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n\n${newNote}` : newNote;

    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ admin_notes: updatedNotes, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Add affiliate note error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/affiliates/:id/contacted
router.post('/:id/contacted', async (req, res) => {
  try {
    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ last_contacted_at: new Date(), lead_status: 'contacted', updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Mark affiliate contacted error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/affiliates/:id/approve
router.post('/:id/approve', async (req, res) => {
  try {
    const { commissionRate } = req.body;
    const updates = {
      status: 'approved',
      lead_status: 'qualified',
      reviewed_at: new Date(),
      updated_at: new Date(),
    };
    if (commissionRate) updates.commission_rate = commissionRate;

    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate(updates) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Approve affiliate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/affiliates/:id/reject
router.post('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    if (reason) {
      const affiliate = await AffiliateRegistration.collection.findOne({ _id: oid(req.params.id) });
      if (affiliate) {
        const norm = normalizeDoc(affiliate);
        const existingNotes = norm.admin_notes || '';
        const timestamp = new Date().toISOString();
        const newNote = `[${timestamp}] Rejection reason: ${reason}`;
        const updatedNotes = existingNotes ? `${existingNotes}\n\n${newNote}` : newNote;
        await AffiliateRegistration.collection.updateOne({ _id: oid(req.params.id) }, { $set: buildDualUpdate({ admin_notes: updatedNotes }) });
      }
    }

    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ status: 'denied', lead_status: 'lost', reviewed_at: new Date(), updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Reject affiliate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/affiliates/:id/generate-code
router.post('/:id/generate-code', async (req, res) => {
  try {
    const affiliate = await AffiliateRegistration.collection.findOne({ _id: oid(req.params.id) });
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });
    
    const norm = normalizeDoc(affiliate);
    if (norm.affiliate_code) {
      return res.status(400).json({ error: 'Affiliate code already exists for this affiliate' });
    }

    const code = await generateAffiliateCode(norm.full_name, norm.email);
    const result = await AffiliateRegistration.collection.findOneAndUpdate(
      { _id: oid(req.params.id) },
      { $set: buildDualUpdate({ affiliate_code: code, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Generate affiliate code error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/affiliates/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await AffiliateRegistration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Affiliate not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete affiliate error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
