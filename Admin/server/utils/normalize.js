// Utility to normalize MongoDB document fields to snake_case
// This handles documents that may have been stored with camelCase field names

const camelToSnakeMap = {
  fullName: 'full_name',
  companyName: 'company_name',
  mobileNumber: 'mobile_number',
  scheduledTime: 'scheduled_time',
  leadStatus: 'lead_status',
  assignedTo: 'assigned_to',
  adminNotes: 'admin_notes',
  responseSent: 'response_sent',
  responseDate: 'response_date',
  responseMethod: 'response_method',
  followUpDate: 'follow_up_date',
  convertedAt: 'converted_at',
  updatedBy: 'updated_by',
  affiliateCode: 'affiliate_code',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  affiliateStatus: 'affiliate_status',
  reviewedAt: 'reviewed_at',
  reviewedBy: 'reviewed_by',
  lastContactedAt: 'last_contacted_at',
  commissionRate: 'commission_rate',
  approvedAt: 'approved_at',
  submittedAt: 'submitted_at',
  contentRaw: 'content_raw',
  contentHtml: 'content_html',
  featuredImage: 'featured_image',
  seoTitle: 'seo_title',
  metaDescription: 'meta_description',
  schemaMarkup: 'schema_markup',
  canonicalUrl: 'canonical_url',
  ctaType: 'cta_type',
  ctaButtonText: 'cta_button_text',
  ctaLink: 'cta_link',
  publishDate: 'publish_date',
  isFeatured: 'is_featured',
  authorId: 'author_id',
  approvedBy: 'approved_by',
  rejectionReason: 'rejection_reason',
  viewCount: 'view_count',
  ctaClicks: 'cta_clicks',
  blogId: 'blog_id',
  eventType: 'event_type',
  eventData: 'event_data',
  userAgent: 'user_agent',
  ipAddress: 'ip_address',
  passwordHash: 'password_hash',
};

export function normalizeDoc(doc) {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(normalizeDoc);

  const normalized = {};
  for (const [key, value] of Object.entries(doc)) {
    // Skip mongoose internals
    if (key === '__v') continue;

    const snakeKey = camelToSnakeMap[key] || key;

    // Don't overwrite if the snake_case version already exists with a real value
    if (snakeKey !== key && normalized[snakeKey] !== undefined && normalized[snakeKey] !== null) {
      continue;
    }

    normalized[snakeKey] = value;
  }

  // Ensure id is set from _id
  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id;
  }

  return normalized;
}

// Convert snake_case keys from frontend to match what MongoDB might have stored
const snakeToCamelMap = Object.fromEntries(
  Object.entries(camelToSnakeMap).map(([k, v]) => [v, k])
);

export function denormalizeFilter(filter) {
  if (!filter) return filter;
  const result = {};
  for (const [key, value] of Object.entries(filter)) {
    if (key === '$or') {
      result.$or = value.map(denormalizeFilter);
      continue;
    }
    // For filter queries, search both camelCase and snake_case
    result[key] = value;
  }
  return result;
}

// Build a filter that works with both camelCase and snake_case data
export function buildDualFilter(snakeKey, value) {
  const camelKey = snakeToCamelMap[snakeKey];
  if (camelKey) {
    return { $or: [{ [snakeKey]: value }, { [camelKey]: value }] };
  }
  return { [snakeKey]: value };
}

// Build a search filter that works with both field name formats
export function buildSearchFilter(snakeFields, searchValue) {
  const conditions = [];
  for (const snakeField of snakeFields) {
    const regexVal = { $regex: searchValue, $options: 'i' };
    conditions.push({ [snakeField]: regexVal });
    const camelField = snakeToCamelMap[snakeField];
    if (camelField) {
      conditions.push({ [camelField]: regexVal });
    }
  }
  return { $or: conditions };
}

// Build a sort that works with both field name formats
export function buildDualSort(snakeKey, direction) {
  // MongoDB will just ignore sort keys that don't exist in a doc
  const sort = { [snakeKey]: direction };
  const camelKey = snakeToCamelMap[snakeKey];
  if (camelKey) {
    sort[camelKey] = direction;
  }
  return sort;
}

/**
 * Build a $set update object that writes BOTH the snake_case AND camelCase
 * versions of every known field.  This guarantees the update hits whichever
 * field name the document was originally created with.
 *
 *   buildDualUpdate({ lead_status: 'contacted', priority: 'high' })
 *   => { lead_status: 'contacted', leadStatus: 'contacted', priority: 'high' }
 *
 * Fields that don't appear in the mapping are passed through unchanged.
 */
export function buildDualUpdate(snakeCaseObj) {
  if (!snakeCaseObj || typeof snakeCaseObj !== 'object') return snakeCaseObj;

  const dual = {};
  for (const [key, value] of Object.entries(snakeCaseObj)) {
    // Always set the key the caller provided
    dual[key] = value;

    // If the key is a known snake_case field, also set its camelCase twin
    const camelKey = snakeToCamelMap[key];
    if (camelKey) {
      dual[camelKey] = value;
    }

    // If the key is a known camelCase field, also set its snake_case twin
    const snakeKey = camelToSnakeMap[key];
    if (snakeKey) {
      dual[snakeKey] = value;
    }
  }
  return dual;
}
