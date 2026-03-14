import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AffiliateRegistration } from '@/models/AffiliateRegistration';
import { withAuth, type JwtPayload } from '@/lib/auth';

export const GET = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const affiliate = await AffiliateRegistration.findById(id).lean();
      if (!affiliate) {
        return NextResponse.json({ success: false, message: 'Affiliate not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: affiliate });
    } catch (error) {
      console.error('Get affiliate error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const PATCH = withAuth(
  async (request: NextRequest, user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const body = await request.json();

      const updateData: Record<string, unknown> = {};
      if (body.status) updateData.status = body.status;
      if (body.admin_notes !== undefined) updateData.adminNotes = body.admin_notes;
      if (body.commission_rate !== undefined) updateData.commissionRate = body.commission_rate;
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = user.email;

      const updated = await AffiliateRegistration.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Affiliate not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Affiliate updated' });
    } catch (error) {
      console.error('Update affiliate error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const DELETE = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const deleted = await AffiliateRegistration.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ success: false, message: 'Affiliate not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Affiliate deleted' });
    } catch (error) {
      console.error('Delete affiliate error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);
