import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Brain } from 'lucide-react';
import { signin } from '../api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/ui/Toast';
import { getErrorMessage } from '../utils/errors';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await signin(username.trim(), password);
      login(res.data.token as string, username.trim());
      showToast(`Welcome back, ${username}! 🧠`, 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err, 'Login failed. Check your credentials.');
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div style={{ position:'fixed', top:'20%', left:'10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.07),transparent)', filter:'blur(80px)', pointerEvents:'none' }} />

      <div className="auth-container anim-scale-in">
        {/* ── LEFT PANEL (Green) ────────────────────────────────── */}
        <div className="auth-panel-green">
          <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:40 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Brain size={20} color="white" />
              </div>
              <span style={{ fontSize:16, fontWeight:700, color:'white' }}>SynapseAI</span>
            </div>
            <h2 style={{ fontSize:28, fontWeight:800, color:'white', lineHeight:1.2, marginBottom:14 }}>
              Welcome<br />Back!
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6, marginBottom:40, maxWidth:220 }}>
              Stay connected — sign in with your personal info
            </p>
            <Link to="/signup" id="go-signup" className="btn btn-outline-white btn-md"
              style={{ textDecoration:'none', display:'inline-flex', fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:700 }}>
              Sign Up
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL (Form) ────────────────────────────────── */}
        <div className="auth-panel-form">
          <div style={{ width:'100%', maxWidth:340 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:6 }}>
              Sign In to Your <span style={{ color:'#10b981' }}>Brain</span>
            </h1>
            <p style={{ fontSize:13, color:'#4b5563', marginBottom:28 }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color:'#10b981', textDecoration:'none', fontWeight:500 }}>Create one →</Link>
            </p>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>Username</label>
                <input id="login-username" className="inp" type="text" placeholder="Enter your username"
                  value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
                  autoComplete="username" autoFocus />
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input id="login-password" className="inp" type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password" value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    autoComplete="current-password" style={{ paddingRight:42 }} />
                  <button type="button" id="toggle-pw" onClick={() => setShowPw(v => !v)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'#4b5563', cursor:'pointer', display:'flex', padding:4, transition:'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color='#10b981')}
                    onMouseLeave={e => (e.currentTarget.style.color='#4b5563')}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding:'10px 14px', borderRadius:9, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:13 }}>
                  {error}
                </div>
              )}

              <button id="login-btn" type="submit" disabled={loading} className="btn btn-primary btn-md"
                style={{ width:'100%', marginTop:6, padding:'13px', fontSize:14, letterSpacing:'0.04em', textTransform:'uppercase' }}>
                {loading
                  ? <span className="spin" style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block' }} />
                  : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
