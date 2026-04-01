'use client';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAffiliatesQuery,
  useUpdateAffiliateStatusMutation,
  useDeleteAffiliateMutation,
  useAddAffiliateNoteMutation,
  useUpdateAffiliateNoteMutation,
  useDeleteAffiliateNoteMutation,
} from '@/store/api/adminApi';

export default function AffiliateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useGetAffiliatesQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateAffiliateStatusMutation();
  const [deleteAff] = useDeleteAffiliateMutation();
  const [addNote, { isLoading: addingNote }] = useAddAffiliateNoteMutation();
  const [updateNote, { isLoading: updatingNote }] = useUpdateAffiliateNoteMutation();
  const [deleteNote] = useDeleteAffiliateNoteMutation();

  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  const raw = data?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: any[] = Array.isArray(raw) ? raw : ((raw as any)?.data ?? []);
  const a = all.find((x) => x._id === id);

  if (!a) return <div className="p-4 bg-status-error-light text-status-error rounded-radius-md text-body-sm">Affiliate not found.</div>;

  const handleDelete = async () => { if (confirm('Delete this affiliate?')) { await deleteAff(id!); navigate('/affiliates'); } };

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    await addNote({ id: id!, text: newNoteText.trim() });
    setNewNoteText('');
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editNoteText.trim()) return;
    await updateNote({ id: id!, noteId, text: editNoteText.trim() });
    setEditingNoteId(null);
    setEditNoteText('');
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Delete this note?')) {
      await deleteNote({ id: id!, noteId });
    }
  };

  const startEditing = (noteId: string, text: string) => {
    setEditingNoteId(noteId);
    setEditNoteText(text);
  };

  const notes = a.adminNotes || [];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/affiliates')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div><h2 className="text-heading-2">{a.fullName}</h2><p className="text-body-sm text-text-muted">{a.email}</p></div>
          <button onClick={handleDelete} className="text-body-sm text-status-error hover:bg-status-error-light px-3 py-1.5 rounded-radius-md">Delete</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-body-sm">
          <div><span className="text-text-muted">Phone:</span> {a.mobileNumber}</div>
          <div><span className="text-text-muted">Code:</span> <span className="font-mono">{a.affiliateCode || '-'}</span></div>
          <div><span className="text-text-muted">Status:</span> {a.status}</div>
          <div><span className="text-text-muted">Submitted:</span> {new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
        <p className="text-body-sm"><span className="text-text-muted">Description:</span> {a.description}</p>

        {/* Status buttons */}
        <div className="border-t border-neutral-100 pt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {['pending', 'approved', 'rejected', 'active', 'inactive'].map((s) => (
              <button key={s} onClick={() => updateStatus({ id: id!, status: s })} disabled={updating || a.status === s} className="px-3 py-1.5 text-body-sm border border-neutral-200 rounded-radius-md hover:bg-neutral-50 disabled:opacity-50 capitalize">{s}</button>
            ))}
          </div>

          {/* Admin Notes Section */}
          <div>
            <label className="text-body-sm font-medium block mb-2">Admin Notes</label>

            {/* Add new note */}
            <div className="flex gap-2 mb-4">
              <textarea
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-4 py-2 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                onClick={handleAddNote}
                disabled={addingNote || !newNoteText.trim()}
                className="px-4 py-2 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50 self-end"
              >
                Add
              </button>
            </div>

            {/* Notes list */}
            {notes.length > 0 ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {[...notes].reverse().map((note: any) => (
                  <div key={note._id} className="bg-neutral-50 border border-neutral-200 rounded-radius-md p-3">
                    {editingNoteId === note._id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={editNoteText}
                          onChange={(e) => setEditNoteText(e.target.value)}
                          className="w-full px-3 py-2 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateNote(note._id)}
                            disabled={updatingNote || !editNoteText.trim()}
                            className="px-3 py-1 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingNoteId(null); setEditNoteText(''); }}
                            className="px-3 py-1 text-body-sm text-text-muted border border-neutral-200 rounded-radius-md hover:bg-neutral-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-body-sm whitespace-pre-wrap">{note.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-body-xs text-text-muted">
                            {note.createdBy} - {new Date(note.createdAt).toLocaleString()}
                            {note.updatedAt !== note.createdAt && ` (edited ${new Date(note.updatedAt).toLocaleString()})`}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(note._id, note.text)}
                              className="text-body-xs text-brand-primary hover:text-brand-accent"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="text-body-xs text-status-error hover:text-status-error/80"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-text-muted">No notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
