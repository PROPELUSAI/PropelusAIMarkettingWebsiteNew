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

      // Migrate legacy null adminNotes to empty array
      await AffiliateRegistration.updateOne(
        { _id: id, adminNotes: null },
        { $set: { adminNotes: [] } }
      );

      // Note operations
      if (body.action === 'add_note') {
        if (!body.text?.trim()) {
          return NextResponse.json({ success: false, message: 'Note text is required' }, { status: 400 });
        }
        const updated = await AffiliateRegistration.findByIdAndUpdate(
          id,
          { $push: { adminNotes: { text: body.text.trim(), createdBy: user.email, createdAt: new Date(), updatedAt: new Date() } } },
          { new: true }
        ).lean();
        if (!updated) return NextResponse.json({ success: false, message: 'Affiliate not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: updated, message: 'Note added' });
      }

      if (body.action === 'update_note') {
        if (!body.noteId || !body.text?.trim()) {
          return NextResponse.json({ success: false, message: 'Note ID and text are required' }, { status: 400 });
        }
        const updated = await AffiliateRegistration.findOneAndUpdate(
          { _id: id, 'adminNotes._id': body.noteId },
          { $set: { 'adminNotes.$.text': body.text.trim(), 'adminNotes.$.updatedAt': new Date() } },
          { new: true }
        ).lean();
        if (!updated) return NextResponse.json({ success: false, message: 'Affiliate or note not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: updated, message: 'Note updated' });
      }

      if (body.action === 'delete_note') {
        if (!body.noteId) {
          return NextResponse.json({ success: false, message: 'Note ID is required' }, { status: 400 });
        }
        const updated = await AffiliateRegistration.findByIdAndUpdate(
          id,
          { $pull: { adminNotes: { _id: body.noteId } } },
          { new: true }
        ).lean();
        if (!updated) return NextResponse.json({ success: false, message: 'Affiliate not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: updated, message: 'Note deleted' });
      }

      // Status/general update
      const updateData: Record<string, unknown> = {};
      if (body.status) updateData.status = body.status;
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
