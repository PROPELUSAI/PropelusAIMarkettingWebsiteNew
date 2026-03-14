/**
 * NewsletterCompose — Dual-mode email campaign composer.
 * Supports "Normal" mode (visual WYSIWYG-like editor) and "HTML" mode
 * (raw HTML with syntax highlighting). Includes live preview pane,
 * file attachments (max 5 MB each via multer), recipient targeting,
 * scheduling, template selection, and test-email sending.
 * @route /newsletter/compose
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsletterService } from '../../services/newsletterService';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { label: 'Blank', subject: '', body: '' },
  {
    label: 'Product Update',
    subject: '🚀 New updates from PropelusAI',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #6366f1;">Hi {{name}},</h1>
  <p>We've been working hard on some exciting new features!</p>
  <h2>What's New</h2>
  <ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul>
  <a href="https://propelusai.com" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Learn More</a>
  <p style="color:#94a3b8;font-size:12px;margin-top:32px;">You're receiving this because you subscribed at PropelusAI.</p>
</div>`,
  },
  {
    label: 'Newsletter',
    subject: '📰 PropelusAI Newsletter — {{month}}',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #6366f1;">PropelusAI Newsletter</h1>
  <p>Hello {{name}},</p>
  <p>Here's what's been happening this month:</p>
  <h2 style="border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🔥 Top Stories</h2>
  <p>Write your newsletter content here...</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
  <p style="color:#94a3b8;font-size:12px;">© 2026 PropelusAI</p>
</div>`,
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.txt', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.csv'];

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) return '📊';
  if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet') || mimeType === 'text/csv') return '📗';
  if (mimeType === 'text/plain') return '📃';
  return '📎';
};

export const NewsletterCompose = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);

  const [stats, setStats] = useState({ active: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('compose');
  const [composeMode, setComposeMode] = useState('normal'); // 'normal' | 'html'
  const [htmlPreview, setHtmlPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    subject: '',
    body_html: '',
    body_text: '',
  });

  const [attachments, setAttachments] = useState([]); // uploaded attachment metadata

  useEffect(() => {
    newsletterService.getStats().then(setStats).catch(() => {});
    newsletterService.getCampaigns().then(setCampaigns).catch(() => {});
  }, []);

  const applyTemplate = (tpl) => {
    const month = format(new Date(), 'MMMM yyyy');
    setForm({
      subject: tpl.subject.replace('{{month}}', month),
      body_html: tpl.body,
      body_text: '',
    });
    setComposeMode('html');
    toast.success(`Template "${tpl.label}" applied (switched to HTML mode)`);
  };

  // ── File Upload ────────────────────────────────────────────────────────

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate
    const totalAttachments = attachments.length + files.length;
    if (totalAttachments > 10) {
      toast.error('Maximum 10 attachments allowed');
      return;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds 5MB limit`);
        return;
      }
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        toast.error(`"${file.name}" — file type not allowed`);
        return;
      }
    }

    try {
      setUploading(true);
      const result = await newsletterService.uploadFiles(files);
      setAttachments((prev) => [...prev, ...result.attachments]);
      toast.success(`${files.length} file(s) uploaded`);
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Reset input so same file can be uploaded again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Send ───────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!form.subject.trim()) return toast.error('Subject is required');

    if (composeMode === 'html' && !form.body_html.trim()) {
      return toast.error('HTML body is required');
    }
    if (composeMode === 'normal' && !form.body_text.trim()) {
      return toast.error('Message body is required');
    }

    if (stats.active === 0) return toast.error('No active subscribers to send to');

    const attachInfo = attachments.length > 0
      ? `\n\nAttachments: ${attachments.length} file(s)`
      : '';

    if (!window.confirm(
      `Send this email to all ${stats.active} active subscribers?\n\nSubject: "${form.subject}"\nMode: ${composeMode === 'html' ? 'HTML' : 'Normal'}${attachInfo}\n\nThis cannot be undone.`
    )) return;

    try {
      setSending(true);
      const result = await newsletterService.sendCampaign({
        subject: form.subject,
        body_html: composeMode === 'html' ? form.body_html : null,
        body_text: composeMode === 'normal' ? form.body_text : null,
        compose_mode: composeMode,
        sent_by: user?.username || 'admin',
        attachments: attachments.length > 0 ? attachments : [],
      });
      toast.success(`✅ Sending to ${result.totalSubscribers} subscribers!`);
      setTimeout(() => {
        newsletterService.getCampaigns().then(setCampaigns).catch(() => {});
      }, 2000);
      setActiveTab('history');
      setForm({ subject: '', body_html: '', body_text: '' });
      setAttachments([]);
    } catch (error) {
      toast.error(`Failed to send: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────────────────────

  const S = {
    page: { padding: '24px', maxWidth: '960px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    backBtn: { padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    tabBar: { display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content' },
    tab: (active) => ({ padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: active ? '#fff' : 'transparent', color: active ? '#6366f1' : '#64748b', boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }),
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
    sectionPad: { padding: '20px', borderBottom: '1px solid #e2e8f0' },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' },
    textarea: (mono) => ({ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: mono ? 'monospace' : 'inherit', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }),
    modeToggle: { display: 'flex', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', width: 'fit-content' },
    modeBtn: (active) => ({ padding: '8px 20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: active ? '#6366f1' : '#f8fafc', color: active ? '#fff' : '#64748b', transition: 'all 0.15s' }),
    previewBtn: (active) => ({ padding: '4px 12px', background: active ? '#6366f1' : '#f1f5f9', color: active ? '#fff' : '#374151', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }),
    previewFrame: { border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '400px', background: '#fff', overflow: 'hidden' },
    previewBar: { background: '#f8fafc', padding: '8px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b' },
    uploadArea: { border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', background: '#fafbfc' },
    fileChip: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' },
    removeBtn: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px', padding: '0 4px', fontWeight: 700 },
    sendRow: { marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' },
    sendBtn: (disabled) => ({ padding: '12px 32px', background: disabled ? '#94a3b8' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }),
    tplLabel: { margin: '0 0 10px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tplBtn: { padding: '6px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 500, color: '#334155' },
  };

  const statusBadge = (status) => {
    const map = {
      sent: { bg: '#dcfce7', color: '#16a34a', label: '✅ Sent' },
      sending: { bg: '#fef9c3', color: '#ca8a04', label: '⏳ Sending' },
      failed: { bg: '#fee2e2', color: '#dc2626', label: '❌ Failed' },
      draft: { bg: '#f1f5f9', color: '#64748b', label: '📝 Draft' },
    };
    const s = map[status] || map.draft;
    return (
      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  const isBodyReady = composeMode === 'html' ? !!form.body_html.trim() : !!form.body_text.trim();
  const canSend = !!form.subject.trim() && isBodyReady && !sending;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>✉️ Newsletter</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            {stats.active} active subscribers
          </p>
        </div>
        <button onClick={() => navigate('/newsletter')} style={S.backBtn}>
          ← Back to Subscribers
        </button>
      </div>

      {/* Tabs */}
      <div style={S.tabBar}>
        {[['compose', '✏️ Compose'], ['history', '📋 History']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={S.tab(activeTab === tab)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── COMPOSE TAB ── */}
      {activeTab === 'compose' && (
        <div>
          {/* Compose Mode Toggle */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Compose Mode
              </p>
              <div style={S.modeToggle}>
                <button onClick={() => { setComposeMode('normal'); setHtmlPreview(false); }} style={S.modeBtn(composeMode === 'normal')}>
                  📝 Normal
                </button>
                <button onClick={() => setComposeMode('html')} style={S.modeBtn(composeMode === 'html')}>
                  🖥️ HTML
                </button>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                {composeMode === 'normal'
                  ? 'Write your email like a normal message — no coding needed'
                  : 'Write raw HTML for full design control — for technical users'}
              </p>
            </div>

            {/* Templates — only in HTML mode */}
            {composeMode === 'html' && (
              <div>
                <p style={S.tplLabel}>Quick Templates</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {TEMPLATES.map((tpl) => (
                    <button key={tpl.label} onClick={() => applyTemplate(tpl)} style={S.tplBtn}>
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Card */}
          <div style={S.card}>
            {/* Subject */}
            <div style={S.sectionPad}>
              <label style={S.label}>Subject Line *</label>
              <input
                type="text"
                placeholder="e.g. 🚀 New updates from PropelusAI"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                style={S.input}
              />
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              {composeMode === 'normal' ? (
                /* ── NORMAL MODE ── */
                <>
                  <label style={S.label}>Message *</label>
                  <textarea
                    placeholder={'Write your email message here...\n\nHi {{name}},\n\nWe wanted to share some exciting updates with you...\n\nBest regards,\nPropelusAI Team'}
                    value={form.body_text}
                    onChange={(e) => setForm((f) => ({ ...f, body_text: e.target.value }))}
                    rows={16}
                    style={S.textarea(false)}
                  />
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    💡 Use <code>{'{{name}}'}</code> to insert subscriber name. Your message will be automatically styled for email.
                  </p>
                </>
              ) : (
                /* ── HTML MODE ── */
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ ...S.label, marginBottom: 0 }}>Email Body (HTML) *</label>
                    <button onClick={() => setHtmlPreview(!htmlPreview)} style={S.previewBtn(htmlPreview)}>
                      {htmlPreview ? '✏️ Edit' : '👁 Live Preview'}
                    </button>
                  </div>

                  {htmlPreview ? (
                    /* Live preview */
                    <div style={{ display: 'flex', gap: '16px', minHeight: '450px' }}>
                      {/* Editor side */}
                      <div style={{ flex: 1 }}>
                        <textarea
                          placeholder="<div>Your HTML here...</div>"
                          value={form.body_html}
                          onChange={(e) => setForm((f) => ({ ...f, body_html: e.target.value }))}
                          rows={22}
                          style={{ ...S.textarea(true), height: '100%', minHeight: '450px' }}
                        />
                      </div>
                      {/* Preview side */}
                      <div style={{ flex: 1, ...S.previewFrame }}>
                        <div style={S.previewBar}>
                          Live Preview ({"{{name}}"} → "Subscriber")
                        </div>
                        <div
                          style={{ padding: '16px', overflow: 'auto', maxHeight: '430px' }}
                          dangerouslySetInnerHTML={{
                            __html: form.body_html.replace(/\{\{name\}\}/g, 'Subscriber'),
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea
                      placeholder={'<div style="font-family: Arial; max-width: 600px; margin: 0 auto;">\n  <h1>Hello {{name}},</h1>\n  <p>Your email content here...</p>\n</div>'}
                      value={form.body_html}
                      onChange={(e) => setForm((f) => ({ ...f, body_html: e.target.value }))}
                      rows={18}
                      style={S.textarea(true)}
                    />
                  )}

                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    💡 Use <code>{'{{name}}'}</code> to insert subscriber name
                  </p>
                </>
              )}
            </div>

            {/* ── ATTACHMENTS ── */}
            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
              <label style={S.label}>📎 Attachments (max 5MB per file)</label>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_EXTENSIONS.join(',')}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#6366f1'; }}
                onDragLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  const dt = e.dataTransfer;
                  if (dt.files.length > 0) {
                    // Simulate file input
                    const fakeEvent = { target: { files: dt.files } };
                    handleFileSelect(fakeEvent);
                  }
                }}
                style={{ ...S.uploadArea, borderColor: uploading ? '#6366f1' : '#e2e8f0' }}
              >
                {uploading ? (
                  <p style={{ margin: 0, color: '#6366f1', fontWeight: 600 }}>⏳ Uploading...</p>
                ) : (
                  <>
                    <p style={{ margin: '0 0 4px', fontSize: '20px' }}>📁</p>
                    <p style={{ margin: 0, fontWeight: 600, color: '#374151' }}>
                      Click to upload or drag & drop files
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                      Images, PDF, TXT, PPT, DOC, XLS — up to 5MB each
                    </p>
                  </>
                )}
              </div>

              {/* Attachment list */}
              {attachments.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {attachments.map((att, index) => (
                    <div key={index} style={S.fileChip}>
                      <span>{getFileIcon(att.mimeType)}</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{att.originalName}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{formatFileSize(att.size)}</div>
                      </div>
                      <button onClick={() => removeAttachment(index)} style={S.removeBtn} title="Remove">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          <div style={S.sendRow}>
            {attachments.length > 0 && (
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                📎 {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
              </span>
            )}
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              Will be sent to <strong>{stats.active}</strong> active subscribers
            </span>
            <button onClick={handleSend} disabled={!canSend} style={S.sendBtn(!canSend)}>
              {sending ? '⏳ Sending...' : `🚀 Send to ${stats.active} Subscribers`}
            </button>
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === 'history' && (
        <div style={S.card}>
          {campaigns.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontWeight: 600 }}>No campaigns sent yet</div>
              <button
                onClick={() => setActiveTab('compose')}
                style={{ marginTop: '16px', padding: '8px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Compose First Campaign
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Subject', 'Mode', 'Status', 'Sent', 'Failed', 'Files', 'Date', 'Sent By'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={c._id || c.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500, maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '6px', background: c.compose_mode === 'html' ? '#ede9fe' : '#f0fdf4', color: c.compose_mode === 'html' ? '#7c3aed' : '#16a34a', fontWeight: 600 }}>
                        {c.compose_mode === 'html' ? '🖥️ HTML' : '📝 Normal'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{statusBadge(c.status)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#16a34a', fontWeight: 600 }}>{c.sent_count ?? '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: c.failed_count > 0 ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>{c.failed_count ?? '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                      {c.attachments && c.attachments.length > 0 ? `📎 ${c.attachments.length}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                      {c.sent_at ? format(new Date(c.sent_at), 'MMM dd, yyyy HH:mm') : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{c.sent_by || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
