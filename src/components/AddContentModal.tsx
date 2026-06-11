import { useState } from 'react';
import { Plus, X, Link2, Play, Bird, FileText, StickyNote } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { createContent } from '../api';
import { showToast } from './ui/Toast';
import { getErrorMessage } from '../utils/errors';
import type { ContentType } from '../types';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const TYPES: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'link',     label: 'Link',     icon: <Link2 size={14} /> },
  { value: 'youtube',  label: 'YouTube',  icon: <Play size={14} /> },
  { value: 'tweet',    label: 'Tweet',    icon: <Bird size={14} /> },
  { value: 'document', label: 'Document', icon: <FileText size={14} /> },
  { value: 'note',     label: 'Note',     icon: <StickyNote size={14} /> },
];

export function AddContentModal({ isOpen, onClose, onAdded }: AddContentModalProps) {
  const [title,    setTitle]    = useState('');
  const [link,     setLink]     = useState('');
  const [note,     setNote]     = useState('');
  const [type,     setType]     = useState<ContentType>('link');
  const [tagInput, setTagInput] = useState('');
  const [tags,     setTags]     = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setTagInput('');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (type !== 'note' && !link.trim()) e.link = 'URL is required for this type';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await createContent({ title: title.trim(), link: link.trim() || undefined, type, tags, note: note.trim() || undefined });
      showToast('Content added to your brain!', 'success');
      onAdded();
      reset();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to add content'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTitle(''); setLink(''); setNote(''); setType('link');
    setTags([]); setTagInput(''); setErrors({});
    onClose();
  };

  const needsLink = type !== 'note';
  const needsNote = type === 'note' || type === 'document';

  return (
    <Modal isOpen={isOpen} onClose={reset} title="Add to your Brain">
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>

        {/* Type selector */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <label style={{ fontSize:12, color:'#6b7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>Type</label>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                id={`type-${t.value}`}
                onClick={() => { setType(t.value); setErrors({}); }}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'7px 13px', borderRadius:10,
                  fontSize:12, fontWeight:500, cursor:'pointer',
                  border:'1px solid',
                  transition:'all 0.18s',
                  background: type === t.value ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.03)',
                  borderColor: type === t.value ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)',
                  color: type === t.value ? 'white' : '#6b7280',
                }}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <Input
          id="content-title"
          label="Title *"
          placeholder="Give your content a title…"
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors({}); }}
          error={errors.title}
        />

        {/* URL */}
        {needsLink && (
          <Input
            id="content-link"
            label={`${type === 'youtube' ? 'YouTube URL' : type === 'tweet' ? 'Tweet URL' : 'URL'} *`}
            placeholder={
              type === 'youtube'  ? 'https://youtube.com/watch?v=…' :
              type === 'tweet'    ? 'https://x.com/user/status/…'  :
              type === 'document' ? 'https://docs.google.com/…'     :
              'https://example.com'
            }
            value={link}
            onChange={e => { setLink(e.target.value); setErrors({}); }}
            error={errors.link}
          />
        )}

        {/* Note textarea */}
        {needsNote && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:13, fontWeight:500, color:'#9ca3af' }}>Note / Description</label>
            <textarea
              id="content-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Write a note or summary…"
              rows={3}
              className="inp"
              style={{ resize:'vertical' }}
            />
          </div>
        )}

        {/* Tags */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#9ca3af' }}>Tags</label>
          <div style={{ display:'flex', gap:8 }}>
            <input
              id="tag-input"
              className="inp"
              placeholder="Add a tag and press Enter…"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              style={{ flex:1 }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>
              <Plus size={14} />
            </Button>
          </div>
          {tags.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {tags.map(t => (
                <span key={t} className="tag" onClick={() => setTags(p => p.filter(x => x !== t))}>
                  #{t} <X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:10, paddingTop:4 }}>
          <Button type="button" variant="ghost" fullWidth onClick={reset}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={loading} id="add-btn">
            Save to Brain
          </Button>
        </div>
      </form>
    </Modal>
  );
}
