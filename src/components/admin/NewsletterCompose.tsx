'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCampaignMutation } from '@/store/api/adminApi';

export default function NewsletterCompose() {
  const navigate = useNavigate();
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) return;
    if (!confirm('Send this campaign to all active subscribers?')) return;
    await createCampaign({ subject, content });
    navigate('/newsletter');
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/newsletter')} className="text-body-sm text-text-muted hover:text-brand-primary flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg> Back
      </button>
      <div className="bg-surface-card border border-neutral-200 rounded-radius-lg p-6 space-y-4">
        <h2 className="text-heading-2">Compose Campaign</h2>
        <div><label className="text-body-sm font-medium block mb-1">Subject Line</label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your email subject..." className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
        <div><label className="text-body-sm font-medium block mb-1">Email Body (HTML)</label><textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} placeholder="<h1>Hello!</h1><p>Your newsletter content...</p>" className="w-full px-4 py-2.5 text-body-sm rounded-radius-md border border-neutral-200 bg-surface-input resize-y font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
        {content && (
          <div><label className="text-body-sm font-medium block mb-1">Preview</label>
            <div className="border border-neutral-200 rounded-radius-md p-4 bg-white" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={handleSend} disabled={isLoading || !subject.trim() || !content.trim()} className="px-6 py-2.5 text-body-sm font-medium bg-brand-primary text-white rounded-radius-md hover:bg-brand-accent disabled:opacity-50">{isLoading ? 'Sending...' : 'Send Campaign'}</button>
          <button onClick={() => navigate('/newsletter')} className="px-6 py-2.5 text-body-sm font-medium border border-neutral-200 rounded-radius-md hover:bg-neutral-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}
