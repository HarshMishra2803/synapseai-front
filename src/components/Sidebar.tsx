import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, LayoutDashboard, Bird, Play, FileText, Link2, StickyNote, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label: 'All',       icon: <LayoutDashboard size={16} />, path: '/dashboard',                   id: 'nav-all'  },
  { label: 'Tweets',    icon: <Bird size={16} />,            path: '/dashboard?type=tweet',         id: 'nav-tweet'},
  { label: 'Videos',    icon: <Play size={16} />,            path: '/dashboard?type=youtube',       id: 'nav-vid'  },
  { label: 'Documents', icon: <FileText size={16} />,        path: '/dashboard?type=document',      id: 'nav-doc'  },
  { label: 'Links',     icon: <Link2 size={16} />,           path: '/dashboard?type=link',          id: 'nav-link' },
  { label: 'Notes',     icon: <StickyNote size={16} />,      path: '/dashboard?type=note',          id: 'nav-note' },
];

interface SidebarProps { isOpen: boolean; onClose: () => void; }

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { pathname, search } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    const [base, q] = path.split('?');
    return pathname === base && (q ? search === '?' + q : !search);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, height: '100vh', width: 232,
    background: '#050505',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column',
    zIndex: 40,
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  };

  return (
    <>
      {/* Desktop: always visible */}
      <style>{`@media(min-width:1024px){.sidebar-wrap{transform:translateX(0)!important;position:static!important;height:auto!important;}}`}</style>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', zIndex:30 }}
          className="anim-fade-in"
        />
      )}

      <aside className="sidebar-wrap" style={sidebarStyle}>
        {/* Logo */}
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Brain size={18} color="white" />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9', letterSpacing:'-0.01em' }}>SynapseAI</p>
              <p style={{ fontSize:11, color:'#374151' }}>Second Brain</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto' }}>
          <p style={{ fontSize:10, fontWeight:600, color:'#374151', textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 8px', marginBottom:6 }}>
            Library
          </p>
          {NAV.map(item => (
            <Link
              key={item.id}
              id={item.id}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* Pro badge */}
          <div style={{ margin:'16px 4px 0', padding:'12px', borderRadius:12, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
              <Zap size={13} color="#34d399" />
              <span style={{ fontSize:12, fontWeight:600, color:'#34d399' }}>Pro Features</span>
            </div>
            <p style={{ fontSize:11, color:'#4b5563', lineHeight:1.5 }}>AI summaries & smart search — coming soon.</p>
          </div>
        </nav>

        {/* User */}
        <div style={{ padding:'12px 12px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white', flexShrink:0 }}>
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:500, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.username ?? 'User'}</p>
            <p style={{ fontSize:11, color:'#374151' }}>Free Plan</p>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            title="Logout"
            style={{ padding:'6px', borderRadius:8, background:'transparent', border:'none', color:'#4b5563', cursor:'pointer', display:'flex', alignItems:'center', transition:'color 0.2s, background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='#4b5563'; e.currentTarget.style.background='transparent'; }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}
