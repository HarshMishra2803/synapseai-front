import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { shareBrain } from '../api';
import { showToast } from './ui/Toast';

export function ShareBrainModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sharing,   setSharing]   = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied,    setCopied]    = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const res  = await shareBrain(true);
      const hash = res.data?.hash;
      if (hash) {
        setShareLink(`${window.location.origin}/shared/${hash}`);
        showToast('Share link generated!', 'success');
      }
    } catch {
      showToast('Could not generate share link.', 'error');
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async () => {
    try {
      await shareBrain(false);
      setShareLink(null);
      showToast('Sharing disabled.', 'info');
    } catch { setShareLink(null); }
  };

  const close = () => { setShareLink(null); setCopied(false); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Share Your Brain">
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* Icon hero */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, paddingBlock:8 }}>
          <div style={{ width:60, height:60, borderRadius:16, background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.1))', border:'1px solid rgba(16,185,129,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }} className="anim-float">
            <Share2 size={26} color="#34d399" />
          </div>
          <p style={{ fontSize:13, color:'#6b7280', textAlign:'center', maxWidth:300, lineHeight:1.6 }}>
            Generate a public read-only link so anyone can browse your second brain.
          </p>
        </div>

        {shareLink ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {/* Link box */}
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.18)' }}>
              <p style={{ flex:1, fontSize:12, color:'#34d399', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {shareLink}
              </p>
              <button
                id="copy-link"
                onClick={handleCopy}
                style={{ flexShrink:0, padding:'4px', borderRadius:7, background:'transparent', border:'none', cursor:'pointer', color: copied ? '#34d399' : '#6b7280', display:'flex', alignItems:'center', transition:'color 0.2s' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Button variant="primary" fullWidth onClick={handleCopy} startIcon={copied ? <Check size={14}/> : <Copy size={14}/>}>
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="danger" onClick={handleRevoke} startIcon={<X size={14}/>}>
                Revoke
              </Button>
            </div>
          </div>
        ) : (
          <Button id="gen-share" variant="primary" fullWidth loading={sharing} onClick={handleShare} startIcon={<Share2 size={15}/>}>
            Generate Share Link
          </Button>
        )}
      </div>
    </Modal>
  );
}
