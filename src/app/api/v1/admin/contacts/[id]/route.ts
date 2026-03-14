import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { withAuth, type JwtPayload } from '@/lib/auth';

export const GET = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const contact = await ContactSubmission.findById(id).lean();
      if (!contact) {
        return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: contact });
    } catch (error) {
      console.error('Get contact error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const PATCH = withAuth(
  async (request: NextRequest, user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const updates = await request.json();

      const updateData: Record<string, unknown> = {};
      if (updates.lead_status) updateData.leadStatus = updates.lead_status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.assigned_to !== undefined) updateData.assignedTo = updates.assigned_to;
      if (updates.admin_notes !== undefined) updateData.adminNotes = updates.admin_notes;
      if (updates.response_sent !== undefined) updateData.responseSent = updates.response_sent;
      if (updates.response_date) updateData.responseDate = new Date(updates.response_date);
      if (updates.response_method !== undefined) updateData.responseMethod = updates.response_method;
      if (updates.follow_up_date !== undefined) {
        updateData.followUpDate = updates.follow_up_date ? new Date(updates.follow_up_date) : null;
      }
      if (updates.status) updateData.leadStatus = updates.status;
      updateData.updatedBy = user.email;

      const updated = await ContactSubmission.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Contact updated' });
    } catch (error) {
      console.error('Update contact error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);

export const DELETE = withAuth(
  async (_request: NextRequest, _user: JwtPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectDB();
      const id = context?.params?.id;
      const deleted = await ContactSubmission.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Contact deleted' });
    } catch (error) {
      console.error('Delete contact error:', error);
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
  }
);
