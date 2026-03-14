import { Router } from 'express';
import ContactSubmission from '../models/ContactSubmission.js';
import AffiliateRegistration from '../models/AffiliateRegistration.js';
import { normalizeDoc, buildSearchFilter, buildDualUpdate } from '../utils/normalize.js';

const router = Router();

// GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const { status, priority, country, affiliateCode, search } = req.query;
    const filter = {};

    if (status) {
      filter.$and = filter.$and || [];
      filter.$and.push({ $or: [{ lead_status: status }, { leadStatus: status }] });
    }
    if (priority) filter.priority = priority;
    if (country) filter.country = country;
    if (affiliateCode) {
      filter.$and = filter.$and || [];
      filter.$and.push({ $or: [{ affiliate_code: affiliateCode }, { affiliateCode: affiliateCode }] });
    }
    if (search) {
      const searchFilter = buildSearchFilter(['full_name', 'email'], search);
      if (filter.$and) {
        filter.$and.push(searchFilter);
      } else {
        Object.assign(filter, searchFilter);
      }
    }

    // Sort by both possible field names
    const contacts = await ContactSubmission.collection
      .find(filter)
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();

    // Normalize and populate affiliate details
    const contactsWithAffiliates = await Promise.all(
      contacts.map(async (contact) => {
        const norm = normalizeDoc(contact);
        if (norm.affiliate_code) {
          const affiliate = await AffiliateRegistration.collection.findOne(
            { $or: [{ affiliate_code: norm.affiliate_code }, { affiliateCode: norm.affiliate_code }] }
          );
          if (affiliate) {
            const normAffiliate = normalizeDoc(affiliate);
            return { ...norm, affiliate: { full_name: normAffiliate.full_name, email: normAffiliate.email, mobile_number: normAffiliate.mobile_number } };
          }
        }
        return { ...norm, affiliate: null };
      })
    );

    res.json(contactsWithAffiliates);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contacts/:id
router.get('/:id', async (req, res) => {
  try {
    let contact;
    try {
      const mongoose = (await import('mongoose')).default;
      contact = await ContactSubmission.collection.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    } catch {
      return res.status(404).json({ error: 'Contact not found' });
    }
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const norm = normalizeDoc(contact);

    if (norm.affiliate_code) {
      const affiliate = await AffiliateRegistration.collection.findOne(
        { $or: [{ affiliate_code: norm.affiliate_code }, { affiliateCode: norm.affiliate_code }] }
      );
      if (affiliate) {
        const normAffiliate = normalizeDoc(affiliate);
        return res.json({ ...norm, affiliate: { full_name: normAffiliate.full_name, email: normAffiliate.email, mobile_number: normAffiliate.mobile_number } });
      }
    }

    res.json({ ...norm, affiliate: null });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/contacts/:id
router.put('/:id', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    // Strip immutable / read-only fields that must never be $set
    const { _id, id, affiliate, created_at, createdAt, updated_at, updatedAt, __v, ...safeBody } = req.body;
    const result = await ContactSubmission.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: buildDualUpdate({ ...safeBody, updated_at: new Date() }) },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Contact not found' });
    res.json(normalizeDoc(result));
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const result = await ContactSubmission.collection.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
