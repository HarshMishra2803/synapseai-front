import { Search, Plus, Share2, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

interface TopbarProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddContent: () => void;
  onShare: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export function Topbar({
  onMenuToggle, isSidebarOpen,
  searchQuery, onSearchChange,
  onAddContent, onShare,
  totalCount, filteredCount,
}: TopbarProps) {
  return (
    <header style={{
      height: 60,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      {/* Mobile menu toggle */}
      <button
        id="menu-toggle"
        onClick={onMenuToggle}
        style={{ display:'none', padding:'6px', borderRadius:8, background:'transparent', border:'none', color:'#6b7280', cursor:'pointer', alignItems:'center' }}
        className="mobile-menu-btn"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search */}
      <div style={{ flex:1, maxWidth:400, position:'relative' }}>
        <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#4b5563', pointerEvents:'none' }} />
        <input
          id="search-input"
          className="input"
          type="text"
          placeholder="Search your brain…"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{ paddingLeft:36, paddingTop:8, paddingBottom:8, fontSize:13 }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'#4b5563', cursor:'pointer', display:'flex' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Count */}
      {totalCount !== undefined && (
        <span style={{ fontSize:12, color:'#374151', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', padding:'4px 10px', borderRadius:8, whiteSpace:'nowrap' }}>
          {searchQuery ? `${filteredCount}/${totalCount}` : totalCount} items
        </span>
      )}

      <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
        <Button id="share-btn" variant="ghost" size="sm" onClick={onShare} startIcon={<Share2 size={14}/>}>
          Share
        </Button>
        <Button id="add-btn" variant="primary" size="sm" onClick={onAddContent} startIcon={<Plus size={14}/>}>
          Add
        </Button>
      </div>

      <style>{`
        @media(max-width:1024px){ .mobile-menu-btn { display:flex !important; } }
      `}</style>
    </header>
  );
}
