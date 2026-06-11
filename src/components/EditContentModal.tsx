import { useState, useEffect, type FormEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { updateContent } from '../api';
import { showToast } from './ui/Toast';
import { getErrorMessage } from '../utils/errors';
import type { Content } from '../types';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: Content) => void;
  content: Content | null;
}

export function EditContentModal({ isOpen, onClose, onUpdated, content }: EditContentModalProps) {
  const [title,    setTitle]    = useState('');
  const [note,     setNote]     = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags,     setTags]     = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Pre-fill form when content changes
  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setNote(content.note ?? '');
      setTags(content.tags ?? []);
      setError('');
      setTagInput('');
    }
  }, [content]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setTagInput('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content) return;
    setLoading(true); setError('');
    try {
      const res = await updateContent(content._id, { title: title.trim(), note: note.trim(), tags });
      showToast('Content updated! ✅', 'success');
      onUpdated(res.data.content as Content);
      onClose();
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to update content');
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Content">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Type badge (read-only) */}
        {content && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
            <span className="badge badge-document" style={{ textTransform: 'capitalize' }}>{content.type ?? 'link'}</span>
          </div>
        )}

        {/* Title */}
        <Input
          id="edit-title"
          label="Title *"
          placeholder="Update the title…"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          error={error}
        />

        {/* Note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>Note / Description</label>
          <textarea
            id="edit-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Update your note…"
            rows={3}
            className="inp"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>Tags</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="edit-tag-input"
              className="inp"
              placeholder="Add tag and press Enter…"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              style={{ flex: 1 }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>
              <Plus size={14} />
            </Button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map(t => (
                <span key={t} className="tag" onClick={() => setTags(p => p.filter(x => x !== t))}>
                  #{t} <X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <Button type="button" variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={loading} id="save-edit-btn">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
