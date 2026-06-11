import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, Plus, RefreshCcw, Filter, X } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { ContentCard } from '../components/ContentCard';
import { AddContentModal } from '../components/AddContentModal';
import { ShareBrainModal } from '../components/ShareBrainModal';
import { Button } from '../components/ui/Button';
import { getContent, deleteContent } from '../api';
import { showToast } from '../components/ui/Toast';
import { getErrorMessage } from '../utils/errors';
import type { Content, ContentType } from '../types';

const ALL = '__all__';

function detectType(c: Content): ContentType {
  if (c.type) return c.type;
  if (!c.link) return 'note';
  const u = c.link.toLowerCase();
  if (u.includes('youtube') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('twitter') || u.includes('x.com'))   return 'tweet';
  if (u.includes('.pdf') || u.includes('docs.google')) return 'document';
  return 'link';
}

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type') as ContentType | null;

  const [items,      setItems]      = useState<Content[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [query,      setQuery]      = useState('');
  const [activeTag,  setActiveTag]  = useState(ALL);
  const [sideOpen,   setSideOpen]   = useState(false);
  const [addOpen,    setAddOpen]    = useState(false);
  const [shareOpen,  setShareOpen]  = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await getContent();
      setItems(res.data.content as Content[] ?? []);
    } catch (e) {
      const msg = getErrorMessage(e, 'Failed to load content');
      setError(msg); showToast(msg, 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchItems(); }, [fetchItems]);

  const handleDelete = async (id: string) => {
    try {
      await deleteContent(id);
      setItems(p => p.filter(c => c._id !== id));
      showToast('Removed from brain.', 'success');
    } catch { showToast('Delete failed.', 'error'); }
  };

  // All unique tags
  const allTags = [...new Set(items.flatMap(c => c.tags ?? []))].sort();

  // Filter
  const filtered = items.filter(c => {
    const t = detectType(c);
    if (typeFilter && t !== typeFilter) return false;
    if (activeTag !== ALL && !(c.tags ?? []).includes(activeTag)) return false;
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.link ?? '').toLowerCase().includes(q) ||
      (c.note ?? '').toLowerCase().includes(q) ||
      (c.tags ?? []).some(tag => tag.includes(q))
    );
  });

  const pageTitle = typeFilter
    ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) + 's'
    : 'All Content';

  return (
    <div style={{ display:'flex', height:'100vh', background:'#000', overflow:'hidden' }}>
      <Sidebar isOpen={sideOpen} onClose={() => setSideOpen(false)} />

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflowY:'auto', marginLeft:232 }} className="main-content">
        <style>{`@media(max-width:1024px){.main-content{margin-left:0!important;}}`}</style>

        <Topbar
          onMenuToggle={() => setSideOpen(!sideOpen)}
          isSidebarOpen={sideOpen}
          searchQuery={query}
          onSearchChange={setQuery}
          onAddContent={() => setAddOpen(true)}
          onShare={() => setShareOpen(true)}
          totalCount={items.length}
          filteredCount={filtered.length}
        />

        <main style={{ flex:1, padding:'24px 24px 40px', maxWidth:1400, width:'100%', margin:'0 auto' }} className="bg-main">

          {/* Page header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#f1f5f9', letterSpacing:'-0.02em' }}>{pageTitle}</h2>
              <p style={{ fontSize:13, color:'#374151', marginTop:3 }}>
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button id="refresh-btn" variant="ghost" size="sm" onClick={fetchItems} startIcon={<RefreshCcw size={13}/>}>
              Refresh
            </Button>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:7, marginBottom:20 }}>
              <Filter size={13} color="#374151" />
              <button onClick={() => setActiveTag(ALL)} className={`tag ${activeTag === ALL ? 'active' : ''}`}>All</button>
              {allTags.map(t => (
                <button key={t} id={`tag-${t}`} onClick={() => setActiveTag(activeTag === t ? ALL : t)} className={`tag ${activeTag === t ? 'active' : ''}`}>
                  #{t}
                </button>
              ))}
              {activeTag !== ALL && (
                <button onClick={() => setActiveTag(ALL)} style={{ display:'flex', alignItems:'center', gap:4, background:'transparent', border:'none', color:'#4b5563', cursor:'pointer', fontSize:12 }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          )}

          {/* States */}
          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <ErrorState msg={error} onRetry={fetchItems} />
          ) : filtered.length === 0 ? (
            <EmptyState hasItems={items.length > 0} query={query} onAdd={() => setAddOpen(true)} />
          ) : (
            <div className="grid-cards">
              {filtered.map((c, i) => (
                <div key={c._id} className="anim-fade-up" style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}>
                  <ContentCard content={c} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <AddContentModal isOpen={addOpen}  onClose={() => setAddOpen(false)}  onAdded={fetchItems} />
      <ShareBrainModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function SkeletonGrid() {
  return (
    <div className="grid-cards">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card" style={{ gap:12 }}>
          <div className="skeleton" style={{ width:70, height:20 }} />
          <div className="skeleton" style={{ width:'80%', height:16 }} />
          <div className="skeleton" style={{ width:'100%', height:120 }} />
          <div style={{ display:'flex', gap:6 }}>
            <div className="skeleton" style={{ width:40, height:16 }} />
            <div className="skeleton" style={{ width:50, height:16 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingBlock:80, gap:16 }}>
      <span style={{ fontSize:40 }}>⚠️</span>
      <p style={{ color:'#f87171', fontSize:14 }}>{msg}</p>
      <Button variant="ghost" size="sm" onClick={onRetry} startIcon={<RefreshCcw size={13}/>}>Try Again</Button>
    </div>
  );
}

function EmptyState({ hasItems, query, onAdd }: { hasItems: boolean; query: string; onAdd: () => void }) {
  if (hasItems && query) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingBlock:80, gap:10 }}>
        <span style={{ fontSize:36 }}>🔍</span>
        <p style={{ color:'#4b5563', fontSize:14 }}>No results for <strong style={{ color:'#9ca3af' }}>"{query}"</strong></p>
      </div>
    );
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingBlock:80, gap:20, textAlign:'center' }}>
      <div className="anim-float" style={{ width:80, height:80, borderRadius:24, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Brain size={38} color="#10b981" />
      </div>
      <div>
        <h3 style={{ fontSize:18, fontWeight:700, color:'#f1f5f9', marginBottom:8 }}>Your brain is empty</h3>
        <p style={{ fontSize:13, color:'#4b5563', maxWidth:280, lineHeight:1.6 }}>Start saving tweets, videos, articles and notes to your second brain.</p>
      </div>
      <Button id="empty-add-btn" variant="primary" onClick={onAdd} startIcon={<Plus size={15}/>} size="lg">
        Add Your First Item
      </Button>
    </div>
  );
}
