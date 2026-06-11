import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, Loader, ExternalLink } from 'lucide-react';
import { getSharedBrain } from '../api';
import { ContentCard } from '../components/ContentCard';
import { getErrorMessage } from '../utils/errors';
import type { Content } from '../types';

export function SharedBrainPage() {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [owner,    setOwner]    = useState('');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (!shareLink) return;
    (async () => {
      try {
        const res = await getSharedBrain(shareLink);
        setContents(res.data.content as Content[] ?? []);
        setOwner(res.data.username as string ?? '');
      } catch (e) {
        setError(getErrorMessage(e, 'Brain not found.'));
      } finally { setLoading(false); }
    })();
  }, [shareLink]);

  if (loading) return (
    <div className="bg-main" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Loader size={28} color="#7c3aed" className="spin" />
    </div>
  );

  if (error) return (
    <div className="bg-main" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:16, textAlign:'center' }}>
      <span style={{ fontSize:48 }}>🔒</span>
      <h1 style={{ fontSize:22, fontWeight:700, color:'#f1f5f9' }}>Brain Not Found</h1>
      <p style={{ color:'#4b5563', fontSize:14, maxWidth:320 }}>{error}</p>
      <Link to="/signup" style={{ marginTop:8, padding:'10px 22px', borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'white', textDecoration:'none', fontSize:14, fontWeight:500 }}>
        Create Your Own Brain
      </Link>
    </div>
  );

  return (
    <div className="bg-main" style={{ minHeight:'100vh' }}>
      {/* Header */}
      <header style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'14px 24px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Brain size={16} color="white" />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{owner ? `${owner}'s Brain` : 'Shared Brain'}</p>
              <p style={{ fontSize:11, color:'#4b5563' }}>Read-only view</p>
            </div>
          </div>
          <Link
            to="/signup"
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background:'linear-gradient(135deg,#10b981,#059669)', color:'white', textDecoration:'none', fontSize:13, fontWeight:500 }}
          >
            <ExternalLink size={13} /> Build Yours
          </Link>
        </div>
      </header>

      <main style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px' }}>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#f1f5f9', marginBottom:6 }}>
          {owner ? `${owner}'s Second Brain` : 'Shared Second Brain'}
        </h2>
        <p style={{ fontSize:13, color:'#374151', marginBottom:24 }}>{contents.length} items shared</p>

        {contents.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingBlock:80, gap:12 }}>
            <span style={{ fontSize:36 }}>🧠</span>
            <p style={{ color:'#4b5563', fontSize:14 }}>Nothing shared yet.</p>
          </div>
        ) : (
          <div className="grid-cards">
            {contents.map((c, i) => (
              <div key={c._id} className="anim-fade-up" style={{ animationDelay:`${i * 50}ms` }}>
                <ContentCard content={c} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
