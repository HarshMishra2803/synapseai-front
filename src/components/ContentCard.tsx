import { useState } from 'react';
import { ExternalLink, Trash2, Bird, Play, FileText, Link2, StickyNote, Pin, Pencil, Sparkles } from 'lucide-react';
import { pinContent, aiSummarize } from '../api';
import { showToast } from './ui/Toast';
import type { Content, ContentType } from '../types';

interface ContentCardProps {
  content: Content;
  onDelete?: (id: string) => void;
  onEdit?: (content: Content) => void;
  onPinToggle?: (id: string, pinned: boolean) => void;
  onSummaryGenerated?: (id: string, summary: string) => void;
}

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([^#&?]{11})/);
  return m ? m[1] : null;
}

function detectType(c: Content): ContentType {
  if (c.type) return c.type;
  if (!c.link) return 'note';
  const u = c.link.toLowerCase();
  if (u.includes('youtube') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('twitter') || u.includes('x.com'))   return 'tweet';
  if (u.includes('.pdf') || u.includes('docs.google')) return 'document';
  return 'link';
}

const typeConfig: Record<ContentType, { icon: React.ReactNode; label: string; badgeClass: string }> = {
  tweet:    { icon: <Bird size={12} />,       label: 'Tweet',    badgeClass: 'badge-tweet'    },
  youtube:  { icon: <Play size={12} />,       label: 'YouTube',  badgeClass: 'badge-youtube'  },
  document: { icon: <FileText size={12} />,   label: 'Document', badgeClass: 'badge-document' },
  link:     { icon: <Link2 size={12} />,      label: 'Link',     badgeClass: 'badge-link'     },
  note:     { icon: <StickyNote size={12} />, label: 'Note',     badgeClass: 'badge-note'     },
};

export function ContentCard({ content, onDelete, onEdit, onPinToggle, onSummaryGenerated }: ContentCardProps) {
  const [deleting,    setDeleting]    = useState(false);
  const [pinning,     setPinning]     = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [hovered,     setHovered]     = useState(false);

  const type = detectType(content);
  const cfg  = typeConfig[type];
  const ytId = type === 'youtube' && content.link ? getYoutubeId(content.link) : null;

  const handleDelete = async () => {
    if (!onDelete || deleting) return;
    setDeleting(true);
    await onDelete(content._id);
    setDeleting(false);
  };

  const handlePin = async () => {
    if (pinning) return;
    setPinning(true);
    try {
      const res = await pinContent(content._id);
      const isPinned = res.data.pinned as boolean;
      onPinToggle?.(content._id, isPinned);
      showToast(isPinned ? '📌 Pinned to top!' : 'Unpinned', 'info');
    } catch {
      showToast('Failed to pin', 'error');
    } finally {
      setPinning(false);
    }
  };

  const handleAiSummary = async () => {
    if (summarizing) return;
    setSummarizing(true);
    showToast('✨ Generating summary…', 'info');
    try {
      const res = await aiSummarize({ title: content.title, note: content.note, link: content.link, type: content.type });
      const summary = res.data.summary as string;
      onSummaryGenerated?.(content._id, summary);
      showToast('Summary ready! ✨', 'success');
    } catch {
      showToast('Failed to generate summary', 'error');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderColor: content.pinned ? 'rgba(16,185,129,0.3)' : undefined }}
    >
      {/* Pin indicator strip */}
      {content.pinned && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#10b981,#059669)', borderRadius: '16px 16px 0 0' }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={`badge ${cfg.badgeClass}`}>{cfg.icon}{cfg.label}</span>
          {content.pinned && <Pin size={11} color="#10b981" fill="#10b981" />}
        </div>

        {/* Actions – visible on hover */}
        <div style={{ display: 'flex', gap: 2, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          {/* AI Summary */}
          <ActionBtn
            id={`ai-${content._id}`}
            title="AI Summary"
            onClick={handleAiSummary}
            loading={summarizing}
            color="#a78bfa"
          >
            <Sparkles size={13} />
          </ActionBtn>

          {/* Edit */}
          {onEdit && (
            <ActionBtn id={`edit-${content._id}`} title="Edit" onClick={() => onEdit(content)} color="#60a5fa">
              <Pencil size={13} />
            </ActionBtn>
          )}

          {/* Pin */}
          <ActionBtn
            id={`pin-${content._id}`}
            title={content.pinned ? 'Unpin' : 'Pin to top'}
            onClick={handlePin}
            loading={pinning}
            color={content.pinned ? '#10b981' : '#6b7280'}
          >
            <Pin size={13} fill={content.pinned ? '#10b981' : 'none'} />
          </ActionBtn>

          {/* Open link */}
          {content.link && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              id={`open-${content._id}`}
              style={{ padding: '5px', borderRadius: 8, color: '#6b7280', display: 'flex', alignItems: 'center', transition: 'color 0.2s, background 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ExternalLink size={13} />
            </a>
          )}

          {/* Delete */}
          {onDelete && (
            <ActionBtn
              id={`del-${content._id}`}
              title="Delete"
              onClick={handleDelete}
              loading={deleting}
              color="#f87171"
              hoverBg="rgba(239,68,68,0.1)"
            >
              <Trash2 size={13} />
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {content.title}
      </h3>

      {/* YouTube embed */}
      {ytId && (
        <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#0a0a0a' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={content.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      )}

      {/* Tweet link */}
      {type === 'tweet' && content.link && (
        <a
          href={content.link} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(29,161,242,0.08)', border: '1px solid rgba(29,161,242,0.2)', color: '#38bdf8', fontSize: 12, textDecoration: 'none' }}
        >
          <Bird size={13} />
          <span style={{ flex: 1 }}>View on X / Twitter</span>
          <ExternalLink size={12} />
        </a>
      )}

      {/* Note / Summary */}
      {content.note && (
        <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {content.note}
        </p>
      )}

      {/* Link URL */}
      {type === 'link' && content.link && (
        <a
          href={content.link} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 11, color: '#10b981', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none', display: 'block' }}
        >
          {content.link}
        </a>
      )}

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'auto' }}>
          {content.tags.map((t: string) => (
            <span key={t} className="tag" style={{ cursor: 'default', fontSize: 10 }}>#{t}</span>
          ))}
        </div>
      )}

      {/* Date */}
      {content.createdAt && (
        <p style={{ fontSize: 11, color: '#374151', marginTop: 'auto' }}>
          {new Date(content.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </div>
  );
}

// ── Reusable action button ────────────────────────────────────────────────────
function ActionBtn({
  id, title, onClick, loading, children, color = '#6b7280', hoverBg = 'rgba(255,255,255,0.06)',
}: {
  id: string; title: string; onClick: () => void; loading?: boolean;
  children: React.ReactNode; color?: string; hoverBg?: string;
}) {
  return (
    <button
      id={id}
      title={title}
      onClick={onClick}
      disabled={loading}
      style={{ padding: '5px', borderRadius: 8, background: 'transparent', border: 'none', color, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s, background 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {loading
        ? <span style={{ width: 13, height: 13, border: `1.5px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
        : children}
    </button>
  );
}
