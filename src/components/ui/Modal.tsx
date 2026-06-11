import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal anim-scale-in" onClick={e => e.stopPropagation()}>
        {/* top accent line */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:120, height:1, background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.8),transparent)', borderRadius:1 }} />

        {title && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontSize:16, fontWeight:600, color:'#f1f5f9' }}>{title}</h2>
            <button
              id="modal-close"
              onClick={onClose}
              style={{ padding:'6px', borderRadius:8, background:'transparent', border:'none', color:'#6b7280', cursor:'pointer', display:'flex', alignItems:'center', transition:'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
            >
              <X size={17} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
