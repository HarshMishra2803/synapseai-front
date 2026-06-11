import { useState } from 'react';
import { ExternalLink, Trash2, Bird, Play, FileText, Link2, StickyNote } from 'lucide-react';
import type { Content, ContentType } from '../types';

interface ContentCardProps {
  content: Content;
  onDelete?: (id: string) => void;
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
  tweet:    { icon: <Bird size={12} />,     label: 'Tweet',    badgeClass: 'badge-tweet'    },
  youtube:  { icon: <Play size={12} />,     label: 'YouTube',  badgeClass: 'badge-youtube'  },
  document: { icon: <FileText size={12} />, label: 'Document', badgeClass: 'badge-document' },
  link:     { icon: <Link2 size={12} />,    label: 'Link',     badgeClass: 'badge-link'     },
  note:     { icon: <StickyNote size={12} />, label: 'Note',   badgeClass: 'badge-note'     },
};

export function ContentCard({ content, onDelete }: ContentCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const type   = detectType(content);
  const cfg    = typeConfig[type];
  const ytId   = type === 'youtube' && content.link ? getYoutubeId(content.link) : null;

  const handleDelete = async () => {
    if (!onDelete || deleting) return;
    setDeleting(true);
    await onDelete(content._id);
    setDeleting(false);
  };

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
        <span className={`badge ${cfg.badgeClass}`}>
          {cfg.icon}{cfg.label}
        </span>

        {/* Actions – visible on hover */}
        <div style={{ display:'flex', gap:4, opacity: hovered ? 1 : 0, transition:'opacity 0.2s' }}>
          {content.link && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              id={`open-${content._id}`}
              style={{ padding:'5px', borderRadius:8, color:'#6b7280', display:'flex', alignItems:'center', transition:'color 0.2s, background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='#34d399'; e.currentTarget.style.background='rgba(16,185,129,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.background='transparent'; }}
            >
              <ExternalLink size={14} />
            </a>
          )}
          {onDelete && (
            <button
              id={`del-${content._id}`}
              onClick={handleDelete}
              disabled={deleting}
              style={{ padding:'5px', borderRadius:8, background:'transparent', border:'none', color:'#6b7280', cursor:'pointer', display:'flex', alignItems:'center', transition:'color 0.2s, background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.background='transparent'; }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize:14, fontWeight:600, color:'#f1f5f9', lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {content.title}
      </h3>

      {/* YouTube embed */}
      {ytId && (
        <div style={{ borderRadius:10, overflow:'hidden', aspectRatio:'16/9', background:'#0a0a0a' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={content.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width:'100%', height:'100%', border:'none' }}
          />
        </div>
      )}

      {/* Tweet link */}
      {type === 'tweet' && content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:10, background:'rgba(29,161,242,0.08)', border:'1px solid rgba(29,161,242,0.2)', color:'#38bdf8', fontSize:12, textDecoration:'none', transition:'background 0.2s' }}
        >
          <Bird size={13} />
          <span style={{ flex:1 }}>View on X / Twitter</span>
          <ExternalLink size={12} />
        </a>
      )}

      {/* Note text */}
      {content.note && (
        <p style={{ fontSize:12, color:'#6b7280', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {content.note}
        </p>
      )}

      {/* Link preview */}
      {type === 'link' && content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize:11, color:'#10b981', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', textDecoration:'none', display:'block' }}
        >
          {content.link}
        </a>
      )}

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:'auto' }}>
          {content.tags.map((t: string) => (
            <span key={t} className="tag" style={{ cursor:'default', fontSize:10 }}>#{t}</span>
          ))}
        </div>
      )}

      {/* Date */}
      {content.createdAt && (
        <p style={{ fontSize:11, color:'#374151', marginTop:'auto' }}>
          {new Date(content.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
        </p>
      )}
    </div>
  );
}
