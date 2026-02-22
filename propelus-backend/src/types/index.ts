import { Request } from 'express';

// ─── Enums ───────────────────────────────────────────

export type LeadStatus =
  | 'open'
  | 'in_progress'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'closed'
  | 'lost'
  | 'spam';

export type Priority = 'high' | 'medium' | 'low';
export type ResponseMethod = 'email' | 'phone' | 'meeting' | 'chat' | 'other';
export type TestimonialStatus = 'pending' | 'approved' | 'rejected';
export type AffiliateStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced';
export type AdminRole = 'super_admin' | 'admin' | 'moderator';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

// ─── JWT Payload ─────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}

// ─── Extended Express Request ────────────────────────

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── Pagination ──────────────────────────────────────

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: PaginationQuery): PaginationOptions {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  return { page, limit, offset: (page - 1) * limit };
}
