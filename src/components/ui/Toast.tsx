import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMsg { id: number; message: string; type: ToastType; }

// ── Imperative global API ─────────────────────────────────────────────────────
// We use a module-level queue + ref pattern so showToast() can be called
// anywhere without prop-drilling. ToastContainer subscribes on mount.
type SetToastsFn = (fn: (p: ToastMsg[]) => ToastMsg[]) => void;

const subscribers = new Set<SetToastsFn>();
let _id = 0;

export function showToast(message: string, type: ToastType = 'info') {
  subscribers.forEach(fn => fn(prev => [...prev, { id: ++_id, message, type }]));
}

// ── Icon / style maps ─────────────────────────────────────────────────────────
const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={16} color="#34d399" />,
  error:   <XCircle    size={16} color="#f87171" />,
  info:    <Info       size={16} color="#60a5fa" />,
  warning: <AlertTriangle size={16} color="#fbbf24" />,
};

const borders: Record<ToastType, string> = {
  success: 'rgba(52,211,153,0.25)',
  error:   'rgba(248,113,113,0.25)',
  info:    'rgba(96,165,250,0.25)',
  warning: 'rgba(251,191,36,0.25)',
};

// ── Single toast item ─────────────────────────────────────────────────────────
function ToastItem({ item, onClose }: { item: ToastMsg; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast-item" style={{ borderColor: borders[item.type] }}>
      {icons[item.type]}
      <p style={{ flex: 1, fontSize: 13, color: '#e2e8f0' }}>{item.message}</p>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Container — mount this once in App ───────────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // Subscribe / unsubscribe using useEffect (no render-time side effects)
  useEffect(() => {
    subscribers.add(setToasts);
    return () => { subscribers.delete(setToasts); };
  }, []);

  const remove = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <ToastItem key={t.id} item={t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}
